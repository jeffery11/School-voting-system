// test-tables.js
const db = require('./config/database');

async function testTables() {
    try {
        console.log('📋 Checking database tables...');
        
        // Check if tables exist and show their structure
        const tables = ['users', 'candidates', 'votes'];
        
        for (let table of tables) {
            const result = await db.query(`
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position
            `, [table]);
            
            if (result.rows.length > 0) {
                console.log(`\n✅ ${table} table structure:`);
                result.rows.forEach(col => {
                    console.log(`   - ${col.column_name} (${col.data_type})`);
                });
            } else {
                console.log(`❌ ${table} table not found`);
            }
        }
        
    } catch (error) {
        console.error('Error checking tables:', error);
    }
}

testTables();