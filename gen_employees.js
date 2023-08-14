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


async function insertFakeEmployees() {
  const client = await pool.connect();
  try {
    for (let i = 1; i <= 100; i++) {
      let firstName = faker.person.firstName();
      let lastName = faker.person.lastName();
      let username = (firstName + lastName).toLowerCase();
      let email = `${firstName}.${lastName}@supplymanager.com`;

      const query = 'INSERT INTO employees (username, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [username, email, firstName, lastName];
      
      const res = await client.query(query, values);
      console.log(res.rows[0]);
    }
  } finally {
    client.release();
  }
}

insertFakeEmployees();