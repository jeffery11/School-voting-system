// test-minimal-server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Minimal server test' });
});

app.listen(PORT, () => {
    console.log(`🔧 Test server running on port ${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/api/health`);
});