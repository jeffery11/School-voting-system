const { Client } = require('pg');
require('dotenv').config();

console.log('Testing connection with these settings:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(empty)');
console.log('DB_PORT:', process.env.DB_PORT);

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => {
    console.log('SUCCESS: Connected to PostgreSQL!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Query result:', result.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('ERROR:', err.message);
    client.end();
  });
