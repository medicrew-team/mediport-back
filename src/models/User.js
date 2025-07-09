const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const User = sequelize.define('User', {
    // 사용자 아이디
    user_id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,     
      primaryKey: true,        
      allowNull: false         
    },
    // 사용자 이메일
    email: {
      type: DataTypes.STRING(255), 
      allowNull: false,            
      unique: true,                
      validate: {
        isEmail: true              
      }
    },
    // 사용자 이름
    user_name: {
        type: DataTypes.STRING(255),
        allowNull: true              
    },
    // 사용자 전화번호
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^\d{3}-\d{3,4}-\d{4}$/,
                msg: '전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678'
        }
    }},
    country:{
        type: DataTypes.STRING(50),
        allowNull: true  
    },
    firebase_uid:{
        type: DataTypes.STRING(28),
        allowNull: false, // Firebase UID는 필수 사항으로 설정
        unique: true, // Firebase UID는 고유해야 함
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // 기본값으로 현재 시간 설정
    }}, {
    tableName: 'User',
    timestamps: false,
  });

module.exports= User;