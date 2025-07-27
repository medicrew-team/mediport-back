const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const user = sequelize.define('user', {
    // 사용자 아이디
    user_id: {
      type: DataTypes.STRING(255),     
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
    // 사용자 거주 지역
    region: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    // 사용자 국가
    country:{
        type: DataTypes.STRING(50),
        allowNull: true  
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // 기본값으로 현재 시간 설정
    }}, {
    tableName: 'user',
    timestamps: false,
  });

module.exports= user;