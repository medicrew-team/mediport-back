const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/sequelize');



const Board = sequelize.define('Board', {
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
            model: 'User',
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
    // 게시판 카테고리
    category: {
        type: DataTypes.STRING(50),
        allowNull: true
    }

}, {
    tableName: 'Board',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Board;