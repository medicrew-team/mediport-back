const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const KrMedi = sequelize.define('KrMedi', {
    kr_medi_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    prod_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    medi_form: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    medi_volume: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    bit: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    atc_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ing_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    prod_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ing_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    purchase_loc: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    icd: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    icd_sum: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dosage: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    contraindicated: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    storage_method: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    daily_interaction: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    drug_interaction: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    adverse_reaction: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    prod_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    tableName: 'kr_medi',
    timestamps: false
});

module.exports = KrMedi;
