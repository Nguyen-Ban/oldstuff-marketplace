const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    blindboxId: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
    status: { 
        type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    }
}, { 
    tableName: 'order', 
    timestamps: false
});

module.exports = Order;
