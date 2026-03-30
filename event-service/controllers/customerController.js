const Vendor = require('../models/vendor');
const Venue = require('../models/venue');
const Event = require('../models/event');
const Booking = require('../models/booking');


exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll({ where: { isAvailable: true } });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getVenues = async (req, res) => {
    try {
        const venues = await Venue.findAll({ where: { isAvailable: true } });
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: { createdBy: req.user.email }
        });

        res.json(events);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, venueId, vendorIds } = req.body;

       
        const venue = await Venue.findByPk(venueId);
        if (!venue) {
            return res.status(400).json({ message: 'Venue not found' });
        }

        // Check venue already used in APPROVED event
        const existingVenueEvent = await Event.findOne({
            where: {
                venueId,
                status: 'APPROVED'
            }
        });

        if (existingVenueEvent) {
            return res.status(400).json({
                message: 'Venue already booked for another event'
            });
        }

        //  Get vendors
        const vendors = await Vendor.findAll({
            where: { id: vendorIds }
        });

        if (vendors.length !== vendorIds.length) {
            return res.status(400).json({ message: 'Invalid vendors selected' });
        }

        // Check vendor conflicts
        const allEvents = await Event.findAll({
            where: { status: 'APPROVED' }
        });

        for (let event of allEvents) {
            const usedVendorIds = event.vendorIds || [];

            for (let vid of vendorIds) {
                if (usedVendorIds.includes(vid)) {
                    return res.status(400).json({
                        message: `Vendor ${vid} already booked in another event`
                    });
                }
            }
        }

        
        let totalBudget = Number(venue.price || 0);

        for (let v of vendors) {
            totalBudget += Number(v.price || 0);
        }

        // Create Event
        const event = await Event.create({
            title,
            description,
            date,
            venueId,
            vendorIds,
            createdBy: req.user.email,
            status: 'APPROVED',
            totalBudget
        });

        // Lock resources
        await venue.update({ isAvailable: false });

        for (let v of vendors) {
            await v.update({ isAvailable: false });
        }

        res.json(event);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Event Details
exports.getEventDetails = async (req, res) => {
    try {

        const { id } = req.params;
        const userEmail = req.user.email;

        
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // VISIBILITY CHECK
        if (
            event.createdBy !== userEmail &&
            event.status !== 'APPROVED'
        ) {
            return res.status(403).json({
                message: 'You are not allowed to view this event'
            });
        }

        
        const venue = await Venue.findByPk(event.venueId);

       
        const vendors = await Vendor.findAll({
            where: {
                id: event.vendorIds
            }
        });

     
        const bookings = await Booking.findAll({
            where: { eventId: event.id }
        });

        // Calculate total tickets
        const totalTickets = bookings.reduce(
            (sum, b) => sum + b.tickets,
            0
        );

        const availableSeats = venue ? venue.capacity - totalTickets : 0;

        
        res.json({
            event,
            venue,
            vendors,
            totalBookings: bookings.length,
            totalTickets,
            availableSeats
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Book Event
exports.bookEvent = async (req, res) => {
    try {

        const { eventId, tickets } = req.body;
        const userEmail = req.user.email;

      
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Prevent booking own event
        if (event.createdBy === userEmail) {
            return res.status(400).json({
                message: 'You cannot book your own event'
            });
        }

        
        if (event.status !== 'APPROVED') {
            return res.status(400).json({ message: 'Event not available for booking' });
        }

        // Prevent duplicate booking
        const existingBooking = await Booking.findOne({
            where: {
                userEmail,
                eventId
            }
        });

        if (existingBooking) {
            return res.status(400).json({
                message: 'You already booked this event'
            });
        }

        
        const venue = await Venue.findByPk(event.venueId);

        // Get total tickets already booked
        const bookings = await Booking.findAll({
            where: { eventId }
        });

        const totalBooked = bookings.reduce(
            (sum, b) => sum + b.tickets,
            0
        );

        // Check capacity
        if (totalBooked + tickets > venue.capacity) {
            return res.status(400).json({
                message: 'Not enough seats available'
            });
        }

        const booking = await Booking.create({
            userEmail,
            eventId,
            tickets
        });

        res.json({
            message: 'Booking successful',
            booking
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// My Bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userEmail: req.user.email }
        });

        const enrichedBookings = [];

        for (let booking of bookings) {
            const event = await Event.findByPk(booking.eventId);

            if (!event) {
                continue;
            }

            const venue = await Venue.findByPk(event.venueId);

            enrichedBookings.push({
                id: booking.id,
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                venueName: venue ? venue.name : null,
                venueLocation: venue ? venue.location : null,
                tickets: booking.tickets,
                status: booking.status
            });
        }

        res.json(enrichedBookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};