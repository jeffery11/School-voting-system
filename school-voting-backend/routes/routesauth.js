const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { student_id, password } = req.body;

  if (!student_id || !password) {
    return res.status(400).json({ error: 'Student ID and password are required' });
  }

  // Find voter by student_id
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

      // Check password
      const passwordValid = bcrypt.compareSync(password, voter.password_hash);
      if (!passwordValid) {
        return res.status(401).json({ error: 'Invalid student ID or password' });
      }

      // Return user data (without password)
      const { password_hash, ...userWithoutPassword } = voter;
      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token: 'demo-token-' + voter.id
      });
    }
  );
});

module.exports = router;