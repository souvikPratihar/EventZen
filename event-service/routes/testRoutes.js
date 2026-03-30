const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin route
router.get('/admin', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

// Customer route
router.get('/customer', authMiddleware, roleMiddleware('CUSTOMER'), (req, res) => {
    res.json({ message: 'Customer access granted' });
});

module.exports = router;