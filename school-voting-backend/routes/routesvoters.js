const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all voters
router.get('/', (req, res) => {
  db.all('SELECT id, name, student_id, has_voted, grade_level, created_at FROM voters ORDER BY name', 
    (err, voters) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch voters' });
      }
      res.json(voters);
    }
  );
});

module.exports = router;