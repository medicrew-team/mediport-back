const { sequelize } = require('../config/sequelize');
const { DataTypes } = require('sequelize');

const UserMediHistory = sequelize.define('UserMediHistory', {
    user_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        }
    },
    kr_medi_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'kr_medi',
            key: 'kr_medi_id'
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '복용 중'
    },
    dosage: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, 
{
    tableName: 'user_medi_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = UserMediHistory;
