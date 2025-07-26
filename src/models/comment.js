const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const comment = sequelize.define('comment', {
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
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'user',
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
            model: 'board',
            key: 'board_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },

}, {
    tableName: 'comment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = comment;

