const { Op } = require('sequelize');
const Restrict = require('../models/restricted_medi.js');

class RestrictService {
    /**
     * 모든 제한 약물 조회 (페이지네이션 및 검색 기능 포함)
     */
    async getRestrictedMedi(page = 1, limit = 10, search = '') {
        try {
            const offset = (page - 1) * limit;

            // 검색어가 있을 경우에만 where 조건을 생성합니다.
            const whereClause = {};
            if (search) {
                whereClause[Op.or] = [
                    { prod_name: { [Op.like]: `%${search}%` } },
                    { ing_name: { [Op.like]: `%${search}%` } }
                ];
            }

            // findAndCountAll을 사용하여 데이터 목록과 전체 카운트를 함께 조회합니다.
            const { count, rows } = await Restrict.findAndCountAll({
                where: whereClause,
                order: [['prod_name', 'ASC']],
                offset: offset,
                limit: limit,
            });

            return { totalCount: count, list: rows };

        } catch (error) {
            console.error('제한 약물 조회 에러 : ', error);
            throw new Error(`제한 약물 조회 실패: ${error.message}`);
        }
    }

    /**
     * ID로 제한 약물 상세 조회
     */
    async getRestrictedMediById(id) {
        try {
            const medi = await Restrict.findByPk(id);
            return medi;
        } catch (error) {
            console.error('제한 약물 상세 조회 에러 : ', error);
            throw new Error(`제한 약물 상세 조회 실패: ${error.message}`);
        }   
}
}


module.exports = new RestrictService();
