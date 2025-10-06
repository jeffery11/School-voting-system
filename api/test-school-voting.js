const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'school_voting',
  password: 'Senanu',
  port: 5432,
});

client.connect()
  .then(() => {
    console.log('Connected to school_voting database');
    return client.query('SELECT * FROM voters');
  })
  .then(result => {
    console.log('Voters found:', result.rows.length);
    client.end();
  })
  .catch(err => {
    console.error('Error connecting to school_voting:', err.message);
    client.end();
  });
