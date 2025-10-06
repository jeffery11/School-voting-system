const { Client } = require('pg');
require('dotenv').config();

console.log('Testing database connection...');
console.log('Database:', process.env.DB_NAME);

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

client.connect()
    .then(() => {
        console.log('✅ Database connected successfully!');
        return client.query('SELECT current_database()');
    })
    .then(result => {
        console.log('📊 Current database:', result.rows[0].current_database);
        client.end();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        client.end();
        process.exit(1);
    });
