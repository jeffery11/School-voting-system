const http = require('http');

const endpoints = [
    '/',
    '/api/health',
    '/api/test-db', 
    '/api/candidates',
    '/api/auth/register',
    '/api/auth/login'
];

async function testEndpoint(endpoint, method = 'GET') {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: endpoint,
            method: method
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    endpoint,
                    method,
                    status: res.statusCode,
                    exists: res.statusCode !== 404
                });
            });
        });

        req.on('error', () => {
            resolve({
                endpoint,
                method,
                status: 'ERROR',
                exists: false
            });
        });

        req.setTimeout(3000, () => {
            resolve({
                endpoint, 
                method,
                status: 'TIMEOUT',
                exists: false
            });
        });

        req.end();
    });
}

async function testAllEndpoints() {
    console.log('🔍 Testing available endpoints on port 3000...\n');
    
    for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint);
        const status = result.exists ? '✅ EXISTS' : '❌ MISSING';
        console.log(`${status} ${result.method} ${endpoint} (Status: ${result.status})`);
    }
}

testAllEndpoints();