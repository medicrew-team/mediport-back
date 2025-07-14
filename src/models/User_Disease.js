const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const User_Disease = sequelize.define('User_Disease', {
    user_disease_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'User',
            key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    disease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Disease',
            key: 'disease_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'User_Disease',
    timestamps: false,
});

module.exports = User_Disease;