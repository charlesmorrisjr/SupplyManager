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
const CASE_WEIGHT = 50, CASE_TIME = 13 * 1000;  // 13 seconds per case

const START_DATE = new Date('2021-08-01'), END_DATE = new Date(Date.now());

// TODO: Only assign trips to employees who orderfillers or lift drivers
// TODO: Make start and end times for trips assigned to the same employee on the same day not overlap

/* algo:
- Loop from START_DATE to END_DATE, incrementing by 1 day and set current date to curDate
  - Loop from MIN_TRIPS_PER_DAY to MIN_TRIPS_PER_DAY + (random number * TRIPS_PER_DAY_RANDOM_RANGE)
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
        - Set employee_id to random number from 1 to totalEmployees
        - Set start_time to random time
      - If completion is 2,
        - Set cases_picked to total_cases
        - Set employee_id to random number from 1 to totalEmployees
        - Set start_time to random time
        - Set end_time to start_time plus standard_time - (TRIP_LENGTH_RANDOM_RANGE / 2) + random number from 0 to TRIP_LENGTH_RANDOM_RANGE minutes
*/

const parseDate = (date) => date.toISOString().replace("T", " ").replace(/\.\d+/, "");

function generateRandomTrip() {
  let curDate = new Date(Date.now());
  let completion = 0;
  let date = curDate;
  let route = faker.number.int({min: 1, max: MAX_ROUTES});
  let stop = faker.number.int({min: 1, max: MAX_STOPS});
  let total_cases = faker.number.int({min: 1, max: MAX_CASES});
  let weight = total_cases * faker.number.int({min: 1, max: CASE_WEIGHT});
  let cases_picked = 0;
  let employee_id = null;
  let door = faker.number.int({min: 1, max: MAX_DOORS});
  let standard_time = CASE_TIME * total_cases;
  let start_time = Date.now();
  let end_time = start_time + (standard_time / 2) + TRIP_LENGTH_RANDOM_RANGE * Math.random();

  // Used for determining order filler performance
  let actual_time = end_time - start_time;
  let performance = ((standard_time / actual_time) * 100).toFixed(2);

  // console.log(total_cases, convertMillisecondsToTime(standard_time), convertMillisecondsToTime(actual_time));
  // let parsedDate = new Date(start_time);
  // const formattedDate = parsedDate.toISOString().replace("T", " ").replace(/\.\d+/, "");
  // console.log(formattedDate);

  return [completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, parseDate(new Date(start_time)), parseDate(new Date(end_time)), convertMillisecondsToTime(standard_time), convertMillisecondsToTime(actual_time)];
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
    const query = 'INSERT INTO trips (completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, start_time, end_time, standard_time, actual_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *';
    // const values = [completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, start_time, end_time, standard_time, actual_time];
    const values = generateRandomTrip();
    
    const res = await client.query(query, values);
    console.log(res.rows[0]);
  } finally {
    client.release();
  }
}

// insertTrips();

// console.log(generateRandomTrip());
generateRandomTrip()