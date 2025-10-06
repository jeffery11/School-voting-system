const { Client } = require('pg');
require('dotenv').config();

async function checkActualDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    const result = await client.query('SELECT current_database()');
    console.log('Actual connected database:', result.rows[0].current_database);
    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkActualDatabase();
