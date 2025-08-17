const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Disease = sequelize.define('Disease', {
    disease_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    disease_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'disease',
    timestamps: false,
});

module.exports = Disease;
