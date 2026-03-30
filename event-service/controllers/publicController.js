const Event = require('../models/event');
const Vendor = require('../models/vendor');
const Venue = require('../models/venue');
const Booking = require('../models/booking');


exports.getPublicEvents = async (req, res) => {
    try {

        const events = await Event.findAll({
            where: { status: 'APPROVED' }
        });

        res.json(events);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Public Event Details
exports.getPublicEventDetails = async (req, res) => {
    try {

        const { id } = req.params;

        const event = await Event.findByPk(id);

        if (!event || event.status !== 'APPROVED') {
            return res.status(404).json({ message: 'Event not available' });
        }

        const venue = await Venue.findByPk(event.venueId);

        const vendors = await Vendor.findAll({
            where: { id: event.vendorIds }
        });

        const bookings = await Booking.findAll({
            where: { eventId: event.id }
        });

        const totalTickets = bookings.reduce(
            (sum, b) => sum + b.tickets,
            0
        );

        const availableSeats = venue.capacity - totalTickets;

        res.json({
            event,
            venue,
            vendors,
            totalTickets,
            availableSeats
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};