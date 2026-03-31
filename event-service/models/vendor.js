const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vendor = sequelize.define(
    'Vendor',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING
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
    },
    {
        tableName: 'vendors',
        freezeTableName: true
    }
);

module.exports = Vendor;