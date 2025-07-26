const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/sequelize');



const kr_medi = sequelize.define('kr_medi', {
    // 약물 ID
    kr_medi_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'kr_medi_id'
    },
    // 제품명
    prod_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // 주성분코드
    ing_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // ATC코드
    atc_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // 성분명
    ATC_ing: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // BIT
    bit: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // ICD
    icd: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // 복용법
    dosage: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // 주의사항
    caution: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // 약품이미지
    prod_img: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // 분류
    category: {
        type: DataTypes.STRING(255),
        allowNull: true
    }},{
    tableName: 'kr_medi',
    timestamps: false,
    });

    module.exports = kr_medi;