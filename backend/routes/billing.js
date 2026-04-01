const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Simple billing route (expand as needed)
router.get('/', protect, (req, res) => {
  res.json({ message: 'Billing route working' });
});

module.exports = router;