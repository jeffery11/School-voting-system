const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve ALL static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ message: 'School Voting System API' });
});

app.get('/api/students', (req, res) => {
    res.json([{ id: 1, name: 'Test Student', grade: '10A' }]);
});

// Serve HTML files directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/results.html'));
});

app.get('/voters', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/voters.html'));
});

app.get('/candidates', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/candidates.html'));
});

// Catch-all for direct HTML file access
app.get('*.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', req.path));
});

// Start server
app.listen(PORT, () => {
    console.log('🎉 SCHOOL VOTING SYSTEM FULLY RUNNING!');
    console.log('======================================');
    console.log('🏠 Frontend Pages:');
    console.log('   http://localhost:3000/');
    console.log('   http://localhost:3000/login');
    console.log('   http://localhost:3000/admin');
    console.log('   http://localhost:3000/results');
    console.log('   http://localhost:3000/voters');
    console.log('   http://localhost:3000/candidates');
    console.log('🔧 API Endpoints:');
    console.log('   http://localhost:3000/api/health');
    console.log('======================================');
});
