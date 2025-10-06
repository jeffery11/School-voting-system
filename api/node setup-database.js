const db = require('./config/database');

async function testTables() {
    try {
        console.log('📋 Checking database tables...');
        
        // Check if users table exists
        const [tables] = await db.execute("SHOW TABLES LIKE 'users'");
        console.log(tables.length > 0 ? '✅ Users table exists' : '❌ Users table missing');
        
        // Check if candidates table exists
        const [candidatesTable] = await db.execute("SHOW TABLES LIKE 'candidates'");
        console.log(candidatesTable.length > 0 ? '✅ Candidates table exists' : '❌ Candidates table missing');
        
        // Check if votes table exists
        const [votesTable] = await db.execute("SHOW TABLES LIKE 'votes'");
        console.log(votesTable.length > 0 ? '✅ Votes table exists' : '❌ Votes table missing');
        
    } catch (error) {
        console.error('Error checking tables:', error);
    } finally {
        db.end();
    }
}

testTables();