const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {

    userEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },

    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tickets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'CONFIRMED'
    }

});

module.exports = Booking;