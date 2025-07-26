const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const category = sequelize.define('category', {
    // 카테고리 ID
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'category_id' // 필드 이름을 명시적으로 지정
    },
    // 카테고리 이름
    category_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    // 부모 카테고리 ID (자기 참조 외래키)
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'category',
            key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // 부모 카테고리가 삭제되면 이 카테고리는 NULL로 설정
    },
    
},{
    tableName: 'category',
    timestamps: false, // createdAt, updatedAt 필드를 사용하지 않음
})

module.exports = category;