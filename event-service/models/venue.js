const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Venue = sequelize.define('Venue', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    capacity: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.FLOAT
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Venue;