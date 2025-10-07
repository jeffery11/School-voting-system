const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Real-time voting features
let connectedClients = 0;
let liveVotes = [];
let candidates = [
    { id: 1, name: 'John Smith', position: 'President' },
    { id: 2, name: 'Sarah Johnson', position: 'President' },
    { id: 3, name: 'Mike Davis', position: 'Vice President' },
    { id: 4, name: 'Emily Chen', position: 'Vice President' }
];

// WebSocket connection handling
io.on('connection', (socket) => {
    connectedClients++;
    console.log('Client connected. Total: ' + connectedClients);
    
    socket.emit('initial-data', {
        totalVotes: liveVotes.length,
        connectedClients: connectedClients,
        candidates: candidates
    });
    
    socket.on('submit-vote', (voteData) => {
        console.log('New vote received:', voteData);
        
        const newVote = {
            studentId: voteData.studentId,
            candidateId: voteData.candidateId,
            id: liveVotes.length + 1,
            timestamp: new Date().toISOString(),
            candidateName: candidates.find(c => c.id == voteData.candidateId)?.name || 'Unknown'
        };
        
        liveVotes.push(newVote);
        
        const results = calculateResults();
        
        io.emit('vote-update', {
            newVote: newVote,
            results: results,
            totalVotes: liveVotes.length,
            connectedClients: connectedClients
        });
        
        socket.emit('vote-confirmed', { 
            success: true, 
            message: 'Your vote has been recorded!'
        });
    });
    
    socket.on('get-results', () => {
        const results = calculateResults();
        socket.emit('current-results', {
            results: results,
            totalVotes: liveVotes.length,
            connectedClients: connectedClients
        });
    });
    
    socket.on('disconnect', () => {
        connectedClients--;
        console.log('Client disconnected. Total: ' + connectedClients);
    });
});

function calculateResults() {
    const results = {};
    
    candidates.forEach(candidate => {
        results[candidate.id] = {
            candidate: candidate,
            votes: liveVotes.filter(vote => vote.candidateId == candidate.id).length
        };
    });
    
    return results;
}

// API Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'School Voting System API is running!',
        timestamp: new Date().toISOString(),
        connectedClients: connectedClients,
        totalVotes: liveVotes.length
    });
});

app.get('/api/students', (req, res) => {
    res.json([{ id: 1, name: 'Test Student', grade: '10A' }]);
});

app.get('/api/live-stats', (req, res) => {
    res.json({
        connectedClients: connectedClients,
        totalVotes: liveVotes.length,
        lastVote: liveVotes[liveVotes.length - 1] || null,
        candidates: candidates
    });
});

app.get('/api/results', (req, res) => {
    res.json({
        results: calculateResults(),
        totalVotes: liveVotes.length
    });
});

// Start server
server.listen(PORT, () => {
    console.log('ENHANCED SCHOOL VOTING SYSTEM!');
    console.log('Frontend: http://localhost:' + PORT);
    console.log('Real-time WebSocket: ACTIVE');
});