// test-complete.js
const db = require('./config/database');

async function testComplete() {
    try {
        console.log('🧪 Running complete system test...\n');
        
        // Test 1: Check all tables exist
        console.log('1. Checking table existence:');
        const tables = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'candidates', 'votes');
        `);
        
        console.log(`   Found ${tables.rows.length} tables:`);
        tables.rows.forEach(table => {
            console.log(`   ✅ ${table.table_name}`);
        });
        
        // Test 2: Check candidates data
        console.log('\n2. Checking candidates data:');
        const candidates = await db.query('SELECT * FROM candidates');
        console.log(`   Found ${candidates.rows.length} candidates:`);
        candidates.rows.forEach(candidate => {
            console.log(`   👤 ${candidate.name} - ${candidate.position} (${candidate.grade_level})`);
        });
        
        // Test 3: Test basic operations
        console.log('\n3. Testing basic operations:');
        
        // Insert test user
        const testUser = await db.query(`
            INSERT INTO users (student_id, name, email, password, grade_level) 
            VALUES ('test123', 'Test User', 'test@school.edu', 'hashedpassword', '10th Grade')
            RETURNING id, student_id, name;
        `);
        console.log(`   ✅ User insertion: ${testUser.rows[0].name} (${testUser.rows[0].student_id})`);
        
        // Clean up test user
        await db.query('DELETE FROM users WHERE student_id = $1', ['test123']);
        console.log('   ✅ User cleanup successful');
        
        console.log('\n🎉 All tests passed! System is ready.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testComplete();