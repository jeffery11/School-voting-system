// test-port.js
const net = require('net');

function checkPort(port) {
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.setTimeout(1000);
        
        client.on('connect', () => {
            client.destroy();
            resolve(true);
        });
        
        client.on('timeout', () => {
            client.destroy();
            resolve(false);
        });
        
        client.on('error', () => {
            resolve(false);
        });
        
        client.connect(port, 'localhost');
    });
}

async function testPort() {
    const port = 3000;
    const isRunning = await checkPort(port);
    
    if (isRunning) {
        console.log(`✅ Server is running on port ${port}`);
    } else {
        console.log(`❌ No server found on port ${port}`);
        console.log('Make sure your server.js has app.listen() and is running');
    }
}

testPort();