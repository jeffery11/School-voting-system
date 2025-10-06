// seed-data.js
const db = require('./config/database');

async function seedData() {
    try {
        console.log('🌱 Seeding sample data...');
        
        // Clear existing data first
        await db.query('DELETE FROM candidates');
        
        // Add sample candidates with correct columns
        await db.query(`
            INSERT INTO candidates (name, position, grade_level, description) 
            VALUES 
            ('John Smith', 'President', '12th Grade', 'Experience in student leadership'),
            ('Maria Garcia', 'President', '11th Grade', 'Passionate about student rights'),
            ('David Chen', 'Vice President', '11th Grade', 'Strong organizational skills'),
            ('Sarah Johnson', 'Vice President', '12th Grade', 'Commitment to school events');
        `);
        
        console.log('✅ Sample candidates added!');
        
        // Verify the data was inserted
        const result = await db.query('SELECT * FROM candidates');
        console.log(`📊 Total candidates: ${result.rows.length}`);
        result.rows.forEach(candidate => {
            console.log(`   - ${candidate.name} (${candidate.position})`);
        });
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

seedData();