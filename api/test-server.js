// test-server.js
const http = require('http');

function testEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
        const req = http.request(`http://localhost:3000${endpoint}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        
        req.on('error', reject);
        req.end();
    });
}

async function testServer() {
    try {
        console.log('Testing server endpoints...');
        
        const health = await testEndpoint('/api/health');
        console.log(`Health endpoint: ${health.status} ${health.data}`);
        
        const candidates = await testEndpoint('/api/candidates');
        console.log(`Candidates endpoint: ${candidates.status} ${candidates.data}`);
        
    } catch (error) {
        console.log('Server not responding or error:', error.message);
        console.log('Make sure the server is running with: npm start');
    }
}

testServer();