const { Client } = require('pg');
require('dotenv').config();

console.log('Testing connection to:', process.env.DB_NAME);

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Test if we can query any table
    const tables = await client.query(\
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    \);
    console.log('Tables in database:', tables.rows.map(r => r.table_name));
    
    // Test voters specifically
    try {
      const voters = await client.query('SELECT COUNT(*) FROM voters');
      console.log('✅ Voters table exists:', voters.rows[0]);
    } catch (votersError) {
      console.log('❌ Voters error:', votersError.message);
    }
    
    client.end();
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

test();
