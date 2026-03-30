const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');

// Homepage events
router.get('/events', publicController.getPublicEvents);

// Event details
router.get('/event/:id', publicController.getPublicEventDetails);

module.exports = router;