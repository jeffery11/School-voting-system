const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all candidates
router.get('/', (req, res) => {
  db.all('SELECT * FROM candidates ORDER BY position, name', (err, candidates) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }
    res.json(candidates);
  });
});

module.exports = router;