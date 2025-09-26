const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const DurChronic = sequelize.define('DurChronic', {
    dur_chronic_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    disease_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'disease',
            key: 'disease_id'
        }
    },
    dur_prod_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ing_code: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    atc_code: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    atc_ing: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    caution: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dur_prod_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'dur_chronic',
    timestamps: false,
});

module.exports = DurChronic;