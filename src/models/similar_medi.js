const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const SimilarMedi = sequelize.define('SimilarMedi',{
    similar_medi_id: {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       allowNull: false
    },
    international_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'international_medi',
            key: 'international_medi_id'
        }
    },
    kr_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kr_medi',
            key: 'kr_medi_id'
        }
    }
},{
    tableName: 'similar_medi',
    timestamps: true
});

module.exports = SimilarMedi;
