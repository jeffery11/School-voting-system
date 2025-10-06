const { Pool } = require('pg');
require('dotenv').config();

console.log('Database connection configured for:', process.env.DB_NAME);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'school_voting',
  password: process.env.DB_PASSWORD || 'Senanu',
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on('connect', (client) => {
  console.log('New client connected to database');
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = {
  query: (text, params) => {
    console.log('Executing query:', text);
    return pool.query(text, params);
  },
  pool,
};
