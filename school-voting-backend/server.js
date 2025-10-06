require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Update CORS for production
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.netlify.app'  // Your actual Netlify URL
  ],
  credentials: true
}));

app.use(express.json());

// Use environment variable for port
const PORT = process.env.PORT || 3001;

// Database setup
const dbPath = path.join(__dirname, 'voting_system.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
function initializeDatabase() {
  db.serialize(() => {
    // Create voters table
    db.run(`CREATE TABLE IF NOT EXISTS voters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      student_id TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      has_voted BOOLEAN DEFAULT FALSE,
      grade_level TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create candidates table
    db.run(`CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      grade TEXT NOT NULL,
      description TEXT,
      campaign_slogan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create votes table
    db.run(`CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voter_id INTEGER NOT NULL,
      candidate_id INTEGER NOT NULL,
      position TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (voter_id) REFERENCES voters (id),
      FOREIGN KEY (candidate_id) REFERENCES candidates (id)
    )`);

    // Insert sample voters with EXACT NAMES YOU PROVIDED
    const defaultPassword = bcrypt.hashSync('password123', 10);
    
    const sampleVoters = [
      ['Alice Johnson', 'STU001', defaultPassword, false, '12th Grade'],
      ['Bob Williams', 'STU002', defaultPassword, false, '11th Grade'],
      ['Carol Davis', 'STU003', defaultPassword, false, '10th Grade'],
      ['Alice Brown', 'STU004', defaultPassword, true, '12th Grade'],
      ['Bob Green', 'STU005', defaultPassword, true, '11th Grade'],
      ['Carol White', 'STU006', defaultPassword, true, '10th Grade'],
      ['David Black', 'STU007', defaultPassword, false, '12th Grade'],
      ['Eva Gray', 'STU008', defaultPassword, true, '11th Grade'],
      ['Frank Blue', 'STU009', defaultPassword, false, '10th Grade']
    ];

    const insertVoter = db.prepare(`INSERT OR IGNORE INTO voters 
      (name, student_id, password_hash, has_voted, grade_level) 
      VALUES (?, ?, ?, ?, ?)`);
    
    sampleVoters.forEach(voter => {
      insertVoter.run(voter);
    });
    insertVoter.finalize();

    // Insert sample candidates
    const sampleCandidates = [
      ['Emma Thompson', 'President', '12th Grade', 'Dedicated to student success', 'Voice for All'],
      ['James Wilson', 'President', '11th Grade', 'Building a better community', 'Progress Together'],
      ['Sophia Chen', 'Vice President', '12th Grade', 'Focused on student activities', 'Active Participation'],
      ['Daniel Martinez', 'Vice President', '11th Grade', 'Advocate for student rights', 'Your Voice Matters'],
      ['Olivia Davis', 'Secretary', '10th Grade', 'Organized and efficient', 'Clear Communication'],
      ['William Brown', 'Treasurer', '12th Grade', 'Financial responsibility', 'Smart Spending']
    ];

    const insertCandidate = db.prepare(`INSERT OR IGNORE INTO candidates 
      (name, position, grade, description, campaign_slogan) 
      VALUES (?, ?, ?, ?, ?)`);
    
    sampleCandidates.forEach(candidate => {
      insertCandidate.run(candidate);
    });
    insertCandidate.finalize();

    console.log('✅ Database initialized with sample data');
    console.log('👥 Voter Names Updated:');
    sampleVoters.forEach(voter => {
      console.log(`   - ${voter[0]} (${voter[1]}) - ${voter[4]} - Voted: ${voter[3]}`);
    });
  });
}

// ===== ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Voting system API is running',
    timestamp: new Date().toISOString()
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { student_id, password } = req.body;

  if (!student_id || !password) {
    return res.status(400).json({ error: 'Student ID and password are required' });
  }

  db.get(
    'SELECT * FROM voters WHERE student_id = ?', 
    [student_id], 
    (err, voter) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!voter) {
        return res.status(401).json({ error: 'Invalid student ID or password' });
      }

      const passwordValid = bcrypt.compareSync(password, voter.password_hash);
      if (!passwordValid) {
        return res.status(401).json({ error: 'Invalid student ID or password' });
      }

      const { password_hash, ...userWithoutPassword } = voter;
      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token: 'demo-token-' + voter.id
      });
    }
  );
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
  db.all('SELECT * FROM candidates ORDER BY position, name', (err, candidates) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }
    res.json(candidates);
  });
});

// Get all voters
app.get('/api/voters', (req, res) => {
  db.all('SELECT id, name, student_id, has_voted, grade_level, created_at FROM voters ORDER BY name', 
    (err, voters) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch voters' });
      }
      res.json(voters);
    }
  );
});

// Cast a vote
app.post('/api/votes', (req, res) => {
  const { voter_id, candidate_id, position } = req.body;

  if (!voter_id || !candidate_id || !position) {
    return res.status(400).json({ error: 'Voter ID, candidate ID, and position are required' });
  }

  db.serialize(() => {
    db.get('SELECT has_voted FROM voters WHERE id = ?', [voter_id], (err, voter) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!voter) {
        return res.status(404).json({ error: 'Voter not found' });
      }

      if (voter.has_voted) {
        return res.status(400).json({ error: 'Voter has already voted' });
      }

      db.get('SELECT id FROM candidates WHERE id = ?', [candidate_id], (err, candidate) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!candidate) {
          return res.status(404).json({ error: 'Candidate not found' });
        }

        db.run(
          'INSERT INTO votes (voter_id, candidate_id, position) VALUES (?, ?, ?)',
          [voter_id, candidate_id, position],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to record vote' });
            }

            db.run(
              'UPDATE voters SET has_voted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
              [voter_id],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Failed to update voter status' });
                }

                res.json({
                  message: 'Vote recorded successfully',
                  vote_id: this.lastID
                });
              }
            );
          }
        );
      });
    });
  });
});

// Get results
app.get('/api/results', (req, res) => {
  db.all(`
    SELECT 
      c.id,
      c.name,
      c.position,
      c.grade,
      COUNT(v.id) as vote_count
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    GROUP BY c.id, c.name, c.position, c.grade
    ORDER BY c.position, vote_count DESC
  `, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch results' });
    }
    res.json(results);
  });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`\n🔑 TEST CREDENTIALS:`);
  console.log(`   Student ID: STU001 | Password: password123 | Name: Alice Johnson`);
  console.log(`   Student ID: STU002 | Password: password123 | Name: Bob Williams`);
  console.log(`   Student ID: STU003 | Password: password123 | Name: Carol Davis`);
  console.log(`   Student ID: STU007 | Password: password123 | Name: David Black`);
  console.log(`   Student ID: STU009 | Password: password123 | Name: Frank Blue`);
  console.log(`\n💡 Some students have already voted (marked as TRUE)`);
});

const API_BASE = 'https://your-netlify-app.netlify.app/api';