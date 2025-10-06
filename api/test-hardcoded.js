const { Client } = require('pg');

// Use the exact same credentials you use in pgAdmin
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'school_voting',
  password: 'Senanu',
  port: 5432,
});

console.log('Testing with hardcoded credentials...');

client.connect()
  .then(() => {
    console.log('SUCCESS: Connected with hardcoded credentials!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Query result:', result.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('ERROR with hardcoded credentials:', err.message);
    client.end();
  });
