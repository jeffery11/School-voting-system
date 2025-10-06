const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'school_voting',
  password: 'Senanu',
  port: 5432,
});

async function testDifferentQueries() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Test 1: Simple query
    const test1 = await client.query('SELECT 1 as test_value');
    console.log('✅ Test 1 (simple query):', test1.rows[0]);
    
    // Test 2: Query with schema prefix
    const test2 = await client.query('SELECT * FROM public.voters LIMIT 1');
    console.log('✅ Test 2 (with schema):', test2.rows[0]);
    
    // Test 3: Query with double quotes
    const test3 = await client.query('SELECT * FROM \"voters\" LIMIT 1');
    console.log('✅ Test 3 (with quotes):', test3.rows[0]);
    
    // Test 4: Count query
    const test4 = await client.query('SELECT COUNT(*) FROM voters');
    console.log('✅ Test 4 (count):', test4.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Error code:', error.code);
  }
}

testDifferentQueries();
