const express = require('express');
const router = express.Router();
const {getBugs, createBug, updateBug, deleteBug} = require('../controllers/bugController');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = require('../utils/auth').verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

router.get('/', getBugs);
router.get('/:id', getBugs);
router.post('/', authenticateToken, createBug);
router.put('/:id', authenticateToken, updateBug);
router.delete('/:id', authenticateToken, deleteBug);

module.exports = router;
