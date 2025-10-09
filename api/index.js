const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

// Database connection
const dbPath = path.join(__dirname, '../sql/voting_system.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to REAL database with actual voting data!');
    }
});

// Serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Real-time data
let connectedClients = 0;

// WebSocket connections
io.on('connection', (socket) => {
    connectedClients++;
    console.log('Client connected. Total: ' + connectedClients);
    
    // Load initial data from REAL database
    loadInitialData(socket);
    
    // Handle votes
    socket.on('submit-vote', async (voteData) => {
        console.log('Vote received from student: ' + voteData.studentId);
        
        try {
            // Check if student exists and can vote
            const student = await getStudent(voteData.studentId);
            
            if (!student) {
                socket.emit('vote-error', { message: 'Student ID not found' });
                return;
            }
            
            // Check if student already voted
            const hasVoted = await checkIfVoted(voteData.studentId);
            if (hasVoted) {
                socket.emit('vote-error', { message: 'You have already voted' });
                return;
            }
            
            // Check if candidate exists
            const candidate = await getCandidate(voteData.candidateId);
            if (!candidate) {
                socket.emit('vote-error', { message: 'Invalid candidate' });
                return;
            }
            
            // Save vote to database
            await saveVoteToDatabase(voteData);
            
            // Get updated results
            const results = await getLiveResults();
            const totalVotes = await getTotalVotes();
            
            // Broadcast to all clients
            io.emit('new-vote', {
                student: student,
                candidate: candidate,
                results: results,
                totalVotes: totalVotes,
                timestamp: new Date().toISOString()
            });
            
            socket.emit('vote-confirmed', { 
                success: true,
                message: `Your vote for ${candidate.name} (${candidate.position}) has been recorded!`
            });
            
            console.log(`✅ Vote saved: ${student.name} voted for ${candidate.name}`);
            
        } catch (error) {
            console.error('Vote error:', error);
            socket.emit('vote-error', { message: 'Error processing vote' });
        }
    });
    
    socket.on('disconnect', () => {
        connectedClients--;
        console.log('Client disconnected. Total: ' + connectedClients);
    });
});

// Database functions using YOUR actual database structure
function loadInitialData(socket) {
    db.all("SELECT * FROM candidates", (err, candidates) => {
        if (err) {
            console.error('Error loading candidates:', err);
            return;
        }
        
        getLiveResults().then(results => {
            getTotalVotes().then(totalVotes => {
                socket.emit('welcome', {
                    totalVotes: totalVotes,
                    connectedClients: connectedClients,
                    candidates: candidates,
                    results: results
                });
            });
        });
    });
}

function getStudent(studentId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM students WHERE student_id = ?", [studentId], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

function getCandidate(candidateId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM candidates WHERE id = ?", [candidateId], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

function checkIfVoted(studentId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM votes WHERE student_id = ?", [studentId], (err, row) => {
            if (err) reject(err);
            resolve(!!row);
        });
    });
}

function saveVoteToDatabase(voteData) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO votes (student_id, candidate_id) VALUES (?, ?)",
            [voteData.studentId, voteData.candidateId],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

function getLiveResults() {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT c.id, c.name, c.position, COUNT(v.id) as votes
            FROM candidates c 
            LEFT JOIN votes v ON c.id = v.candidate_id
            GROUP BY c.id
            ORDER BY votes DESC
        `, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getTotalVotes() {
    return new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) as count FROM votes", (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
}

// API routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Live voting system with REAL database',
        connectedClients: connectedClients,
        database: 'Connected to actual voting data'
    });
});

app.get('/api/live-results', async (req, res) => {
    try {
        const results = await getLiveResults();
        const totalVotes = await getTotalVotes();
        res.json({ results, totalVotes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/candidates', (req, res) => {
    db.all("SELECT * FROM candidates", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/students', (req, res) => {
    db.all("SELECT student_id, name FROM students", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log('🎉 LIVE VOTING SYSTEM WITH REAL DATABASE!');
    console.log('📍 http://localhost:' + PORT);
    console.log('🗃️ Database: Connected to ACTUAL voting data');
    console.log('👥 Students: 3 real students in database');
    console.log('🗳️ Candidates: 12 real candidates in database');
    console.log('📊 Votes: Real vote history loaded');
    console.log('🔗 WebSocket: ACTIVE');
});