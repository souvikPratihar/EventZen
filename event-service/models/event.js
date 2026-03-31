const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define(
    'Event',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        venueId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vendorIds: {
            type: DataTypes.JSON,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'APPROVED'
        },
        totalBudget: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'events',
        freezeTableName: true
    }
);

module.exports = Event;