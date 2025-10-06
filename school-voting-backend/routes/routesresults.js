const express = require('express');
const db = require('../database');
const router = express.Router();

// Get election results
router.get('/', (req, res) => {
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

module.exports = router;