// routes/candidates.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all candidates
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM candidates ORDER BY position, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM candidates WHERE id = $1', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;