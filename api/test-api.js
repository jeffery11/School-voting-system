const testAPI = async () => {
  console.log('🎯 Testing School Voting System API...\n');
  
  const tests = [
    { name: 'Basic API', url: 'http://localhost:3000/' },
    { name: 'Health Check', url: 'http://localhost:3000/api/health' },
    { name: 'Database Test', url: 'http://localhost:3000/api/test-db' },
    { name: 'Candidates', url: 'http://localhost:3000/api/candidates' },
    { name: 'Voters', url: 'http://localhost:3000/api/voters' }
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(test.url);
      if (!response.ok) throw new Error(\HTTP \\);
      const data = await response.json();
      
      if (test.name === 'Health Check') {
        console.log(\✅ \: \ (DB: \)\);
      } else if (test.name === 'Voters' || test.name === 'Candidates') {
        console.log(\✅ \: \ records found\);
      } else {
        console.log(\✅ \: Working\);
      }
    } catch (error) {
      console.log(\❌ \: Failed - \\);
    }
  }
};

testAPI();
