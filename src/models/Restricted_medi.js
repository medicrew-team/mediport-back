const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Restricted_medi = sequelize.define('Restricted_medi',{
    restricted_medi_id:
    {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       allowNull: false,
    },
    division: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ing_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    prod_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Medi_img: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
},{
    tableName: 'Restricted_medi'
})

module.exports= Restricted_medi;