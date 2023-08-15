const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');
require('dotenv').config();

const { DATABASE_URL } = process.env;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const MAX_EMPLOYEES = 100, MAX_CASES = 400, MAX_DOORS = 30;
const MIN_ROUTES = 30, MAX_ROUTES = 50, MAX_STOPS = 4;
const MIN_TRIPS_PER_DAY = 400, TRIPS_PER_DAY_RANDOM_RANGE = 200, TRIP_LENGTH_RANDOM_RANGE = 1000 * 60 * 60 * 0.5;
const CASE_WEIGHT = 30, CASE_TIME = 13 * 1000;  // 13 seconds per case

// const START_DATE = new Date('07-01-2023'), END_DATE = new Date('07-31-2023');
const START_DATE = new Date(), END_DATE = new Date();

// TODO: Only assign trips to employees who are orderfillers or lift drivers
// TODO: Make start and end times for trips assigned to the same employee on the same day not overlap

/* algo:
- Loop from START_DATE to END_DATE, incrementing by 1 day and set current date to curDate
  - Loop from 1 to MIN_TRIPS_PER_DAY + (random number * TRIPS_PER_DAY_RANDOM_RANGE)
    - For current trip
      - Set date to curDate
      - Set route to random number from 1 to MAX_ROUTES
      - Set stop to random number from 1 to MAX_STOPS
      - Set total_cases to random number from 1 to MAX_CASES
      - Set weight to total_cases times random number from 1 to CASE_WEIGHT
      - Set door from 1 to MAX_DOORS
      - Set standard_time to CASE_TIME multipled by total_cases
    - Set completion to random number from 0 to 2
      - If completion is 1,
        - Set cases_picked to random number from 0 to total_cases
        - Set employee_id to random number from 1 to MAX_EMPLOYEES
        - Set start_time to random time for the day
      - If completion is 2,
        - Set cases_picked to total_cases
        - Set employee_id to random number from 1 to MAX_EMPLOYEES
        - Set start_time to random time
        - Set end_time to start_time plus standard_time - (TRIP_LENGTH_RANDOM_RANGE / 2) + random number from 0 to TRIP_LENGTH_RANDOM_RANGE minutes
*/

const parseDate = (date) => date.toISOString().replace("T", " ").replace(/\.\d+/, "");

function genWeight(totalCases){
  let weight = 0;
  
  for (let i = 0; i < totalCases; i++) {
    weight += faker.number.int({min: 1, max: CASE_WEIGHT});
  }
  return weight;
} 

function generateRandomTrip(curDate) {
  let date = curDate;
  let route = faker.number.int({min: 1, max: MAX_ROUTES});
  let stop = faker.number.int({min: 1, max: MAX_STOPS});
  let total_cases = faker.number.int({min: 1, max: MAX_CASES});
  let weight = genWeight(total_cases);
  let door = faker.number.int({min: 1, max: MAX_DOORS});
  let standard_time = CASE_TIME * total_cases;
  
  let completion = faker.number.int({min: 0, max: 2});
  let cases_picked = 0;
  let employee_id = null;
  let start_time, end_time;

  if (completion !== 0) {
    employee_id = faker.number.int({min: 1, max: MAX_EMPLOYEES});
    start_time = faker.date.between({ from: date, to: new Date(date.getTime() + 1000 * 60 * 60 * 24) });
    end_time = start_time.getTime() + (standard_time / 2) + TRIP_LENGTH_RANDOM_RANGE * Math.random();
  }

  if (completion === 1) {
    cases_picked = faker.number.int({min: 0, max: total_cases});
  } else if (completion === 2) {
    cases_picked = total_cases;
  }

  // Used for determining order filler performance
  let actual_time = end_time - start_time;
  let performance = ((standard_time / actual_time) * 100).toFixed(2);

  // console.log(total_cases, convertMillisecondsToTime(standard_time), convertMillisecondsToTime(actual_time));
  // let parsedDate = new Date(start_time);
  // const formattedDate = parsedDate.toISOString().replace("T", " ").replace(/\.\d+/, "");
  // console.log(formattedDate);

  return [completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, start_time ? parseDate(new Date(start_time)) : null, end_time ? parseDate(new Date(end_time)) : null, convertMillisecondsToTime(standard_time)];
  // return {completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, standard_time: convertMillisecondsToTime(standard_time), start_time: new Date(start_time), end_time: new Date(end_time), performance};
}

function convertMillisecondsToTime(ms) {
  let hours = Math.floor(ms / 1000 / 60 / 60);
  let minutes = Math.floor((ms - (hours * 1000 * 60 * 60)) / 1000 / 60);
  let seconds = Math.floor((ms - (hours * 1000 * 60 * 60) - (minutes * 1000 * 60)) / 1000);
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return formattedTime;
}

async function insertTrips() {
  let client = await pool.connect();
  try {
    const query = 'INSERT INTO trips (completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, start_time, end_time, standard_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
    // const values = [completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, start_time, end_time, standard_time];

    console.log('Inserting trips...');
    
    for (let curDate = START_DATE; curDate <= END_DATE; curDate.setDate(curDate.getDate() + 1)) {
      // let numTrips = MIN_TRIPS_PER_DAY + Math.floor(Math.random() * TRIPS_PER_DAY_RANDOM_RANGE);
      let numTrips = 10;
      
      console.log(curDate);
  
      for (let curTrip = 1; curTrip <= numTrips; curTrip++) {
  
        const values = generateRandomTrip(curDate);
        
        const res = await client.query(query, values);
        // console.log(res.rows[0]);
      }
    }
  } finally {
    client.release();
  }
}

insertTrips();

// console.log(generateRandomTrip(new Date()));
// generateRandomTrip(new Date())