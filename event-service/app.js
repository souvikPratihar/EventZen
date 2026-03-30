const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');


const Vendor = require('./models/vendor');
const Venue = require('./models/venue');
const Event = require('./models/event');
const Booking = require('./models/booking');


const testRoutes = require('./routes/testRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api', testRoutes);        // test routes
app.use('/api/admin', adminRoutes); // admin routes
app.use('/api/customer', customerRoutes); // customer routes
app.use('/api/public', publicRoutes); // public routes
// Default route
app.get('/', (req, res) => {
    res.send('Event Service Running');
});


sequelize.sync({ alter: true })   
    .then(() => console.log('Database synced'))
    .catch(err => console.log('DB Error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});