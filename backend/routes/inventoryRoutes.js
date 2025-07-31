const express = require('express');
const router = express.Router();

// Example placeholder route
router.get('/', (req, res) => {
  res.json({ message: 'Inventory routes placeholder' });
});

module.exports = router; 