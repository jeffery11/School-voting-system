const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Submit a vote
router.post('/', async (req, res) => {
    try {
        const { user_id, candidate_id, position } = req.body;

        // Check if user has already voted for this position
        const existingVote = await db.query(
            'SELECT * FROM votes WHERE user_id = $1 AND position = $2',
            [user_id, position]
        );

        if (existingVote.rows.length > 0) {
            return res.status(400).json({ error: 'You have already voted for this position' });
        }

        // Record the vote
        await db.query(
            'INSERT INTO votes (user_id, candidate_id, position) VALUES ($1, $2, $3)',
            [user_id, candidate_id, position]
        );

        // Update candidate vote count
        await db.query(
            'UPDATE candidates SET votes = votes + 1 WHERE id = $1',
            [candidate_id]
        );

        // Mark user as voted
        await db.query(
            'UPDATE users SET has_voted = true WHERE id = $1',
            [user_id]
        );

        res.json({ message: 'Vote recorded successfully' });

    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get voting results
router.get('/results', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, COUNT(v.id) as total_votes
            FROM candidates c 
            LEFT JOIN votes v ON c.id = v.candidate_id 
            GROUP BY c.id 
            ORDER BY c.position, total_votes DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
