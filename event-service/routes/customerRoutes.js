const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const customerController = require('../controllers/customerController');

// View vendors
router.get('/vendors',
    authMiddleware,
    roleMiddleware(['CUSTOMER', 'ADMIN']),
    customerController.getVendors
);

// View venues
router.get('/venues',
    authMiddleware,
    roleMiddleware(['CUSTOMER', 'ADMIN']),
    customerController.getVenues
);

// My Events
router.get('/events',
    authMiddleware,
    roleMiddleware('CUSTOMER'),
    customerController.getMyEvents
);

// Create event
router.post('/event',
    authMiddleware,
    roleMiddleware('CUSTOMER'),
    customerController.createEvent
);

// Event Details
router.get('/event/:id',
    authMiddleware,
    roleMiddleware(['CUSTOMER', 'ADMIN']),
    customerController.getEventDetails
);

// Book Event
router.post('/book',
    authMiddleware,
    roleMiddleware('CUSTOMER'),
    customerController.bookEvent
);

// My Bookings
router.get('/bookings',
    authMiddleware,
    roleMiddleware('CUSTOMER'),
    customerController.getMyBookings
);

module.exports = router;