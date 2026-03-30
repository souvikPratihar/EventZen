const PDFDocument = require('pdfkit');
const Event = require('../models/event');
const Vendor = require('../models/vendor');
const Venue = require('../models/venue');
const Booking = require('../models/booking');

// Get all vendors for admin
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Vendor
exports.addVendor = async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendorId = Number(req.params.id);

        const vendor = await Vendor.findByPk(vendorId);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Block deletion only if vendor is used in any APPROVED event
        const approvedEvents = await Event.findAll({
            where: { status: 'APPROVED' }
        });

        const isAssignedInApprovedEvent = approvedEvents.some((event) => {
            const vendorIds = event.vendorIds || [];
            return vendorIds.includes(vendorId);
        });

        if (isAssignedInApprovedEvent) {
            return res.status(400).json({
                message: 'This vendor is assigned in an approved event and cannot be deleted'
            });
        }

        await Vendor.destroy({ where: { id: vendorId } });

        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all venues for admin
exports.getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.findAll();
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Venue
exports.addVenue = async (req, res) => {
    try {
        const venue = await Venue.create(req.body);
        res.json(venue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Venue
exports.deleteVenue = async (req, res) => {
    try {
        const venueId = Number(req.params.id);

        const venue = await Venue.findByPk(venueId);

        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // Block deletion only if venue is used in any APPROVED event
        const approvedEvent = await Event.findOne({
            where: {
                venueId,
                status: 'APPROVED'
            }
        });

        if (approvedEvent) {
            return res.status(400).json({
                message: 'This venue is assigned in an approved event and cannot be deleted'
            });
        }

        await Venue.destroy({ where: { id: venueId } });

        res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all events (with optional status filter)
exports.getAllEvents = async (req, res) => {
    try {
        const { status } = req.query;

        let condition = {};

        if (status) {
            condition.status = status;
        }

        const events = await Event.findAll({
            where: condition
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get full event details for admin
exports.getEventDetails = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const venue = await Venue.findByPk(event.venueId);

        const vendors = await Vendor.findAll({
            where: { id: event.vendorIds }
        });

        const bookings = await Booking.findAll({
            where: { eventId: event.id }
        });

        const totalTickets = bookings.reduce((sum, b) => sum + b.tickets, 0);
        const availableSeats = venue ? venue.capacity - totalTickets : 0;

        res.json({
            event,
            venue,
            vendors,
            bookings,
            totalBookings: bookings.length,
            totalTickets,
            availableSeats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete Event
exports.completeEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const venue = await Venue.findByPk(event.venueId);
        if (venue) {
            await venue.update({ isAvailable: true });
        }

        const vendors = await Vendor.findAll({
            where: { id: event.vendorIds }
        });

        for (let v of vendors) {
            await v.update({ isAvailable: true });
        }

        await event.update({ status: 'COMPLETED' });

        res.json({ message: 'Event completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject Event
exports.rejectEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const venue = await Venue.findByPk(event.venueId);
        if (venue) {
            await venue.update({ isAvailable: true });
        }

        const vendors = await Vendor.findAll({
            where: { id: event.vendorIds }
        });

        for (let v of vendors) {
            await v.update({ isAvailable: true });
        }

        await event.update({ status: 'REJECTED' });

        res.json({ message: 'Event rejected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Download budget PDF 
exports.downloadBudgetPdf = async (req, res) => {
    try {
        const venues = await Venue.findAll({ order: [['location', 'ASC'], ['name', 'ASC']] });
        const vendors = await Vendor.findAll({ order: [['type', 'ASC'], ['name', 'ASC']] });

        const totalVenuePrice = venues.reduce((sum, venue) => {
            return sum + Number(venue.price || 0);
        }, 0);

        const totalVendorPrice = vendors.reduce((sum, vendor) => {
            return sum + Number(vendor.price || 0);
        }, 0);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="budget-summary.pdf"');

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });

        doc.pipe(res);

        // Title
        doc
            .font('Helvetica-Bold')
            .fontSize(22)
            .text('Budget Summary', { align: 'center' });

        doc.moveDown(1.5);

        // Venues section
        doc
            .font('Helvetica-Bold')
            .fontSize(16)
            .text('Venues');

        doc.moveDown(0.6);

        if (venues.length === 0) {
            doc
                .font('Helvetica')
                .fontSize(12)
                .text('No venues available.');
        } else {
            venues.forEach((venue, index) => {
                doc
                    .font('Helvetica-Bold')
                    .fontSize(12)
                    .text(`${index + 1}. ${venue.name}`);

                doc
                    .font('Helvetica')
                    .fontSize(12)
                    .text(`Location: ${venue.location}`)
                    .text(`Price: ${venue.price}`);

                doc.moveDown(0.6);
            });
        }

        doc.moveDown(0.8);

        // Vendors section
        doc
            .font('Helvetica-Bold')
            .fontSize(16)
            .text('Vendors');

        doc.moveDown(0.6);

        if (vendors.length === 0) {
            doc
                .font('Helvetica')
                .fontSize(12)
                .text('No vendors available.');
        } else {
            vendors.forEach((vendor, index) => {
                doc
                    .font('Helvetica-Bold')
                    .fontSize(12)
                    .text(`${index + 1}. ${vendor.name}`);

                doc
                    .font('Helvetica')
                    .fontSize(12)
                    .text(`Type: ${vendor.type}`)
                    .text(`Price: ${vendor.price}`);

                doc.moveDown(0.6);
            });
        }

        doc.moveDown(1);

        // Totals
        doc
            .font('Helvetica-Bold')
            .fontSize(14)
            .text(`Total Venue Price: ${totalVenuePrice}`, { align: 'center' });

        doc.moveDown(0.4);

        doc
            .font('Helvetica-Bold')
            .fontSize(14)
            .text(`Total Vendor Price: ${totalVendorPrice}`, { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};