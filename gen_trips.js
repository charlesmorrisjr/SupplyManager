const { faker } = require('@faker-js/faker');
require('dotenv').config();

const pgp = require('pg-promise')({
  capSQL: true // generate capitalized SQL 
});

const { DATABASE_URL } = process.env;

const cn = {
  connectionString: DATABASE_URL,
  ssl: true,
  max: 30,
  allowExitOnIdle: true
};

const db = pgp(cn);

const MAX_EMPLOYEES = 100, MAX_CASES = 400, MAX_DOORS = 30;
const MIN_ROUTES = 30, MAX_ROUTES = 50, MAX_STOPS = 4;
const MIN_TRIPS_PER_DAY = 400, TRIPS_PER_DAY_RANDOM_RANGE = 200, TRIP_LENGTH_RANDOM_RANGE = 1000 * 60 * 60 * 0.5; // 30 minute range
const CASE_WEIGHT = 30, CASE_TIME = 13 * 1000;  // 13 seconds per case
const MIN_ITEM_NUM = 1, MAX_ITEM_NUM = 1807154;
const TRIP_BATCH_SIZE = 500;

const MS_PER_HOUR = 1000 * 60 * 60;

const TODAYS_DATE = new Date(new Date().setHours(0, 0, 0, 0));

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

// Parse date to format YYYY-MM-DD HH:MM:SS
const parseDate = (date) => date.toISOString().replace("T", " ").replace(/\.\d+/, "");

function genWeight(totalCases){
  let weight = 0;
  
  for (let i = 0; i < totalCases; i++) {
    weight += faker.number.int({min: 1, max: CASE_WEIGHT});
  }
  return weight;
}

async function generateItems(tripInfo) {
  // Creating a reusable/static ColumnSet for generating INSERT queries:    
  const cs = new pgp.helpers.ColumnSet([
    'trip_id',
    'item_id',
    { name: 'quantity', def: 1 }
  ], {table: 'trip_details'});

  // data = array of objects that represent the import data:
  const data = [
    // {trip_id: 122269, item_id: 1},
    // {trip_id: 122269, item_id: 2}
  ];

  tripInfo.forEach((trip) => {
    let trip_id = trip[0];
    let cases = trip[1];
    for (let i = 1; i <= cases; i++) {
      data.push({trip_id, item_id: faker.number.int({min: MIN_ITEM_NUM, max: MAX_ITEM_NUM})});
    }
  });
  
  const insert = pgp.helpers.insert(data, cs);
  
  await db.none(insert)
  .then(() => {
    // console.log('success');
  })
  .catch(error => {
    console.log(error);
  });
}

function generateRandomTrip(curDate) {
  let date = curDate;
  let route = faker.number.int({min: 1, max: MAX_ROUTES});
  let stop = faker.number.int({min: 1, max: MAX_STOPS});
  let total_cases = faker.number.int({min: 1, max: MAX_CASES});
  let weight = genWeight(total_cases);
  let door = faker.number.int({min: 1, max: MAX_DOORS});
  let standard_time = CASE_TIME * total_cases;
  
  let completion;
  if (curDate.toString() !== TODAYS_DATE.toString()) {
    completion = 2;
  } else {
    completion = faker.number.int({min: 0, max: 2});
  }

  let cases_picked = 0;
  let employee_id = null;
  let start_time, end_time;
  let performance = null;

  if (completion !== 0) {
    employee_id = faker.number.int({min: 1, max: MAX_EMPLOYEES});
    start_time = faker.date.between({ from: date, to: new Date(date.getTime() + MS_PER_HOUR * 24) });
  }

  if (completion === 1) {
    cases_picked = faker.number.int({min: 0, max: total_cases});
  } else if (completion === 2) {
    cases_picked = total_cases;
    end_time = start_time.getTime() + (standard_time / 2) + faker.number.int(standard_time);  // Range is 0.5 standard time to 1.5 standard time

    // Determine order filler performance
    let actual_time = end_time - start_time;
    performance = ((standard_time / actual_time) * 100).toFixed(2);
  }
  
  return {
    completion,
    weight, 
    route, 
    stop, 
    total_cases, 
    cases_picked, 
    date: parseDate(date), 
    employee_id, 
    door,
    start_time: start_time ? parseDate(new Date(start_time)) : null,
    end_time: end_time ? parseDate(new Date(end_time)) : null,
    standard_time: convertMillisecondsToTime(standard_time),
    performance
  };
}

function convertMillisecondsToTime(ms) {
  let hours = Math.floor(ms / 1000 / 60 / 60);
  let minutes = Math.floor((ms - (hours * MS_PER_HOUR)) / 1000 / 60);
  let seconds = Math.floor((ms - (hours * MS_PER_HOUR) - (minutes * 1000 * 60)) / 1000);
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return formattedTime;
}

async function insertTrips(startDate = new Date(TODAYS_DATE), endDate = new Date(TODAYS_DATE)) {  
    let curTripID;
    let tripInfo = [];
    
    // Get the id of the last trip in the database
    await db.any('SELECT MAX(id) FROM trips', [true])
    .then(function(data) {
      curTripID = Number(data[0].max) + 1;
      // console.log(data[0].max);
      // console.log(curTripID);
    })
    .catch(function(error) {
        console.log(error);
    });

    // const query = 'INSERT INTO trips (completion, weight, route, stop, total_cases, cases_picked, date, employee_id, door, start_time, end_time, standard_time, performance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *';

    // Creating a reusable/static ColumnSet for generating INSERT queries:    

    const cs = new pgp.helpers.ColumnSet([
      'completion',
      'weight',
      'route',
      'stop',
      'total_cases',
      'cases_picked',
      'date',
      'employee_id',
      'door',
      'start_time',
      'end_time',
      'standard_time',
      'performance'
    ], {table: 'trips'});

    // data = array of objects that represent the import data:
    const data = [];

    for (let curDate = startDate; curDate <= endDate; curDate.setDate(curDate.getDate() + 1)) {
      let numTrips = MIN_TRIPS_PER_DAY + Math.floor(Math.random() * TRIPS_PER_DAY_RANDOM_RANGE);
      // let numTrips = 1;
      
      console.log(curDate);

      for (let curTrip = 1; curTrip <= numTrips; curTrip++) {
        data.push(generateRandomTrip(curDate));
        tripInfo.push([curTripID, data[data.length - 1].total_cases]);
        curTripID++;
      }
    }
    const insert = pgp.helpers.insert(data, cs);

    await db.none(insert)
    .then(() => {
      console.log('success');
    })
    .catch(error => {
      console.log(error);
    });

    console.log('Generating items...');
    
    // Generate items in batches of TRIP_BATCH_SIZE to avoid overloading the database
    for (let i = 0; i < tripInfo.length; i += TRIP_BATCH_SIZE) {
      await generateItems(tripInfo.slice(i, i + TRIP_BATCH_SIZE));
      console.log(`${i}/${tripInfo.length}`)
    }
}

if ((new Date(process.argv[2])).toString() !== 'Invalid Date' && (new Date(process.argv[3])).toString() !== 'Invalid Date') {
  console.log(`Inserting trips from ${process.argv[2]} to ${process.argv[3]}...`);
  insertTrips(new Date(process.argv[2]), new Date(process.argv[3]));
} else if (process.argv.length === 2) {
  console.log(`Inserting trips for ${TODAYS_DATE}...`);
  insertTrips();
} else if ((new Date(process.argv[2])).toString() === 'Invalid Date' || (new Date(process.argv[3])).toString() === 'Invalid Date') {
  console.log('Invalid date(s)');
  console.log('Please enter two valid dates (ex: gen_trips 01-01-2023 01-31-2023) or no dates to (ex: gen_trips)');
}

// generateItems([[182727, 2]]);
// insertTrips();