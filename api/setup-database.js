// setup-database.js
const db = require('./config/database');

async function setupDatabase() {
    let client;
    try {
        console.log('🚀 Setting up database tables...');

        // Create tables SQL
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                student_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                grade_level VARCHAR(20) NOT NULL,
                has_voted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS candidates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                position VARCHAR(50) NOT NULL,
                grade_level VARCHAR(20) NOT NULL,
                description TEXT,
                votes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS votes (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id),
                candidate_id INT REFERENCES candidates(id),
                position VARCHAR(50) NOT NULL,
                voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, position)
            );
        `;

        await db.query(sql);
        console.log('✅ Database tables created successfully!');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error);
    } finally {
        // For PostgreSQL pool, we don't need to manually end the connection
        // The pool will manage connections automatically
        console.log('🏁 Database setup completed!');
    }
}

setupDatabase();