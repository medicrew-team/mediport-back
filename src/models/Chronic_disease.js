const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/sequelize');



const Chronic_disease = sequelize.define('Chronic_disease', {
    
    chronic_disease_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
     },
    chronic_disease_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // user_id(외래키)
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // DUR_Chronic 모델 참조
            key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
},
},{
    tableName: 'Chronic_disease',
    timestamps: false,
});

module.exports = Chronic_disease;