const { Client } = require('pg');

console.log('Testing connection to school_voting database...');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'school_voting',
  password: 'Senanu',
  port: 5432,
});

client.connect()
  .then(() => {
    console.log('✅ SUCCESS: Connected to school_voting database!');
    return client.query('SELECT current_database()');
  })
  .then(result => {
    console.log('📊 Current database:', result.rows[0].current_database);
    client.end();
  })
  .catch(err => {
    console.error('❌ ERROR:', err.message);
    client.end();
  });
