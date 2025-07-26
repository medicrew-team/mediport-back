const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/sequelize');



const board = sequelize.define('board', {
    //게시판 id
    board_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // 게시판 제목
    title : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // 게시판 내용
    content: {
        type:DataTypes.TEXT,
        allowNull: false
    },
    // 작성자 ID (외래키)
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
    // 조회수
    view: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    // 카테고리
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'category',
            key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // 카테고리가 삭제되면 이 게시판의 카테고리는 NULL로 설정
    },
    

}, {
    tableName: 'board',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = board;