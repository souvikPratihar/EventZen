const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Vendors
router.get(
    '/vendors',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.getAllVendors
);

router.post(
    '/vendor',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.addVendor
);

router.delete(
    '/vendor/:id',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.deleteVendor
);

// Venues
router.get(
    '/venues',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.getAllVenues
);

router.post(
    '/venue',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.addVenue
);

router.delete(
    '/venue/:id',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.deleteVenue
);

// Events
router.get(
    '/events',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.getAllEvents
);

router.get(
    '/event/:id',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.getEventDetails
);

router.put(
    '/event/:id/complete',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.completeEvent
);

router.put(
    '/event/:id/reject',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.rejectEvent
);

// Budget PDF
router.get(
    '/budget/pdf',
    authMiddleware,
    roleMiddleware('ADMIN'),
    adminController.downloadBudgetPdf
);

module.exports = router;