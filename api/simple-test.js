async function testAPI() {
  const endpoints = [
    'http://localhost:3000/',
    'http://localhost:3000/api/health',
    'http://localhost:3000/api/test-db',
    'http://localhost:3000/api/candidates',
    'http://localhost:3000/api/voters'
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (url.includes('/health')) {
        console.log('✅ Health: ' + data.status + ' (DB: ' + data.current_database + ')');
      } else if (url.includes('/voters') || url.includes('/candidates')) {
        console.log('✅ ' + url.split('/').pop() + ': ' + data.length + ' records');
      } else {
        console.log('✅ ' + url + ': Working');
      }
    } catch (error) {
      console.log('❌ ' + url + ': ' + error.message);
    }
  }
}

testAPI();
