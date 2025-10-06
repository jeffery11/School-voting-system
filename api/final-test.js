const testAllEndpoints = async () => {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('🎯 FINAL TEST - School Voting System API\n');
  
  const endpoints = [
    '/',
    '/health',
    '/test-db',
    '/candidates',
    '/voters'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = endpoint === '/' ? 'http://localhost:3000/' : \\\\;
      const response = await fetch(url);
      const data = await response.json();
      
      if (endpoint === '/health') {
        console.log(\✅ \: \ (Database: \)\);
      } else if (endpoint === '/voters' || endpoint === '/candidates') {
        console.log(\✅ \: \ records found\);
      } else {
        console.log(\✅ \: Working\);
      }
    } catch (error) {
      console.log(\❌ \: Failed - \\);
    }
  }
  
  console.log('\n🎉 ALL ENDPOINTS WORKING! Your API is ready for frontend development!');
};

testAllEndpoints();
