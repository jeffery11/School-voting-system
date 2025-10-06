// fix-candidates-table.js
const db = require('./config/database');

async function fixCandidatesTable() {
    try {
        console.log('🔧 Fixing candidates table structure...');
        
        // Add missing columns to candidates table
        await db.query(`
            ALTER TABLE candidates 
            ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20),
            ADD COLUMN IF NOT EXISTS description TEXT;
        `);
        
        console.log('✅ Candidates table structure updated!');
        
        // Verify the changes
        const result = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'candidates' 
            ORDER BY ordinal_position;
        `);
        
        console.log('\n📊 Updated candidates table structure:');
        result.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`);
        });
        
    } catch (error) {
        console.error('❌ Error fixing table:', error);
    }
}

fixCandidatesTable();