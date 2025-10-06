const express = require('express');
const db = require('../database');
const router = express.Router();

// Cast a vote
router.post('/', (req, res) => {
  const { voter_id, candidate_id, position } = req.body;

  if (!voter_id || !candidate_id || !position) {
    return res.status(400).json({ error: 'Voter ID, candidate ID, and position are required' });
  }

  // Start transaction
  db.serialize(() => {
    // Check if voter exists and hasn't voted
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

      // Check if candidate exists
      db.get('SELECT id FROM candidates WHERE id = ?', [candidate_id], (err, candidate) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!candidate) {
          return res.status(404).json({ error: 'Candidate not found' });
        }

        // Record the vote
        db.run(
          'INSERT INTO votes (voter_id, candidate_id, position) VALUES (?, ?, ?)',
          [voter_id, candidate_id, position],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to record vote' });
            }

            // Mark voter as voted
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

module.exports = router;