const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Comment = sequelize.define('Comment', {
    // 댓글 id
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // 댓글 내용
    content: {
        type:DataTypes.TEXT,
        allowNull: false
    },
    // 작성자 ID (외래키)
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    // 게시판 ID (외래키)
    board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Board',
            key: 'board_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },

}, {
    tableName: 'Comment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Comment;

