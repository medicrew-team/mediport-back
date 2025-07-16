// src/models/DUR_Chronic.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const International_medi = sequelize.define('International_medi', {
    international_medi_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'International_Medi_id'
    },
    // 제품명
    prod_name: {
        type: DataTypes.STRING(255), // 충분한 길이로 변경 권장 (또는 실제 최대 길이 확인 후 설정)
        allowNull: false
    },
    // 주성분코드
    ing_code: {
        type: DataTypes.STRING(50), // 실제 코드 길이에 맞춰 확인
        allowNull: false
    },
    // 국가
    country: {
        type: DataTypes.STRING(50), // 실제 코드 길이에 맞춰 확인
        allowNull: false
    },
    // 성분명 (모델 필드명 소문자, DB 컬럼명 대문자일 경우 field 옵션 사용)
    atc_ing: { 
        type: DataTypes.STRING(255), 
        allowNull: false,
    },
    // 약품이미지
    dur_prod_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'International_medi', // 실제 DB 테이블 이름과 일치하는지 확인 (대소문자)
});

module.exports = International_medi;
