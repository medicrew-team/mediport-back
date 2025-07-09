const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Similar_medi = sequelize.define('Similar_medi',{
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
            model: 'International_medi',
            key: 'International_medi_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    kr_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'KR_medi',
            key: 'kr_medi_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
},{
    tableName: 'Similar_medi'
})

module.exports= Similar_medi;