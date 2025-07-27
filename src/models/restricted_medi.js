const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const restricted_medi = sequelize.define('restricted_medi',{
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
    medi_img: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    punish: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    //대체 약품
    substitute: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    // 대체약품 이미지
    substitute_img: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
},{
    tableName: 'restricted_medi',
    timestamps: false
})

module.exports= restricted_medi;