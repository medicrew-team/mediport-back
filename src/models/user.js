const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  user_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_img: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user',
  timestamps: true,
  updatedAt: false,
  createdAt: 'created_at'
});

module.exports = User;
