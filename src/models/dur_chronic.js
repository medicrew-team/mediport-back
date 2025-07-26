
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const dur_chronic = sequelize.define('dur_chronic', {
    // 기저질환 DUR ID
    dur_chronic_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    // 제품명
    dur_prod_name: {
        type: DataTypes.STRING(255), 
        allowNull: false
    },
    // 주성분코드
    ing_code: {
        type: DataTypes.STRING(50), 
        allowNull: false
    },
    // ATC코드
    atc_code: {
        type: DataTypes.STRING(50), // 실제 코드 길이에 맞춰 확인
        allowNull: false
    },
    // 성분명
    atc_ing: { 
        type: DataTypes.STRING(255), 
        allowNull: false,
        field: 'atc_ing' 
    },
    // 약품이미지
    dur_prod_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'dur_chronic', 
    timestamps: false,
});

module.exports = dur_chronic;
