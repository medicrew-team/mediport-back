const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const UserDisease = sequelize.define('UserDisease', {
    user_disease_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        }
    },
    disease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'disease',
            key: 'disease_id'
        }
    }
}, {
    tableName: 'user_disease',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'disease_id']
        }
    ]
});

module.exports = UserDisease;
