const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

const db = new sqlite3.Database(':memory:'); // In-memory database for testing

// Create tables
db.serialize(() => {
  db.run('CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, student_id TEXT)');
  db.run('CREATE TABLE voters (id INTEGER PRIMARY KEY, email TEXT, name TEXT)');
  db.run('CREATE TABLE candidates (id INTEGER PRIMARY KEY, name TEXT, position_id INTEGER)');
  
  // Insert sample data
  db.run(\INSERT INTO students (name, student_id) VALUES 
    ('Test Student 1', 'S1001'),
    ('Test Student 2', 'S1002')\);
});

app.use(express.json());

app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/voters', (req, res) => {
  db.all('SELECT * FROM voters', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/candidates', (req, res) => {
  db.all('SELECT * FROM candidates', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log('SQLite server running on port ' + PORT);
});
