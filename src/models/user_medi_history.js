const { sequelize } = require('../config/sequelize');
const { DataTypes } = require('sequelize');

const user_medi_history = sequelize.define('user_medi_history', {
    // 사용자 ID (외래키)
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    // 의약품 ID (외래키)
    kr_medi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kr_medi',
            key: 'kr_medi_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    // 복용 시작 날짜
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // 복용 종료 날짜
    end_date: {
        type: DataTypes.DATE,
        allowNull: true // 종료 날짜는 선택 사항
    },
    // 복용 상태 (예: '복용 중', '복용 완료', '복용 중단')
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '복용 중' // 기본값은 '복용 중'
    },
    // 복용량 (예: '1일 1회', '1일 2회' 등)
    dosage: {
        type: DataTypes.STRING(100),
        allowNull: true // 복용량은 선택 사항
    }}, 
    {
        tableName: 'user_medi_history',
        timestamps: true, // createdAt, updatedAt 필드를 사용
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    module.exports = user_medi_history;