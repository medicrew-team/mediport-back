const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const RestrictedMedi = sequelize.define('RestrictedMedi',{
    restricted_medi_id: {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       allowNull: false
    },
    division: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ing_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    prod_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    medi_img: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    punish: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    substitute: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    substitute_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    tableName: 'restricted_medi',
    timestamps: false
});

module.exports = RestrictedMedi;
