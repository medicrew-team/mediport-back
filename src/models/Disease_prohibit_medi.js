const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/sequelize');



const Disease_prohibit_medi = sequelize.define('Disease_prohibit_medi', {
    
    disease_prohibit_medi_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
     },
    // 질병 ID (외래키)

    disease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Disease', // Disease 모델 참조
            key: 'disease_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
},
   // 약물 DUR ID (외래키)
   dur_chronic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'DUR_Chronic', // DUR_Chronic 모델 참조
            key: 'dur_chronic_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
},
},{
    tableName: 'Disease_prohibit_medi',
    timestamps: false,
});

module.exports = Disease_prohibit_medi;