// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { student_id, name, email, password, grade_level } = req.body;
        
        // Basic validation
        if (!student_id || !name || !email || !password || !grade_level) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT * FROM users WHERE student_id = $1 OR email = $2',
            [student_id, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Insert new user (in real app, hash the password!)
        const result = await db.query(
            'INSERT INTO users (student_id, name, email, password, grade_level) VALUES ($1, $2, $3, $4, $5) RETURNING id, student_id, name, email, grade_level',
            [student_id, name, email, password, grade_level]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint (basic version)
router.post('/login', async (req, res) => {
    try {
        const { student_id, password } = req.body;
        
        const result = await db.query(
            'SELECT id, student_id, name, email, grade_level FROM users WHERE student_id = $1 AND password = $2',
            [student_id, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;