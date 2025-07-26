const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const similar_medi = sequelize.define('similar_medi',{
    similar_medi_id:
    {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       allowNull: false,
    },
    international_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'international_medi',
            key: 'international_medi_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'international_medi_id'
    },
    kr_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kr_medi',
            key: 'kr_medi_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'kr_medi_id'
    }
},{
    tableName: 'similar_medi'
})

module.exports= similar_medi;