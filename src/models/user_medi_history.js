const { sequelize } = require('../config/sequelize');
const { DataTypes } = require('sequelize');

const UserMediHistory = sequelize.define('UserMediHistory', {
    history_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        }
    },
    kr_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: true,   // kr_medi에 없는 약이면 NULL
        references: {
            model: 'kr_medi',
            key: 'kr_medi_id'
        }
    },
    custom_name: {
        type: DataTypes.STRING(255), // 사용자가 직접 입력한 약품명
        allowNull: true
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
