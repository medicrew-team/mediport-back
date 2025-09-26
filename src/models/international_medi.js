const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const InternationalMedi = sequelize.define('InternationalMedi', {
    international_medi_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    prod_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    matching: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    realsame: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    bit: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    atc_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ing_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ing_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    prod_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    prod_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'international_medi',
    timestamps: false
});

module.exports = InternationalMedi;