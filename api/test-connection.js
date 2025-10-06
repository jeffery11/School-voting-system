const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Trying to connect with:');
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

pool.query('SELECT NOW()')
  .then(res => {
    console.log('Connection successful!', res.rows[0]);
    pool.end();
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    pool.end();
  });
