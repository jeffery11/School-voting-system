const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testVoters() {
  try {
    await client.connect();
    console.log('Connected to:', process.env.DB_NAME);
    
    // Test simple count
    const count = await client.query('SELECT COUNT(*) FROM voters');
    console.log('Voters count:', count.rows[0]);
    
    // Test actual data
    const data = await client.query('SELECT * FROM voters LIMIT 1');
    console.log('First voter:', data.rows[0]);
    
    client.end();
  } catch (error) {
    console.error('Direct test error:', error.message);
    client.end();
  }
}

testVoters();
