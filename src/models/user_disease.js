const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const user_disease = sequelize.define('user_disease', {
    user_disease_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'user_disease_id'
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    disease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'disease',
            key: 'disease_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'user_disease',
    timestamps: false,
});

module.exports = user_disease;