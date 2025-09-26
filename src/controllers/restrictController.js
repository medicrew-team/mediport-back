const RestrictService = require('../services/RestrictService');

exports.getRestrictedMedis = async (req, res, next) => {
    try {
        // 쿼리 파라미터에서 페이지, 제한, 검색어 추출 (기본값 설정)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || '';

        // 서비스 호출
        const { totalCount, list } = await RestrictService.getRestrictedMedi(page, limit, search);

        // 성공 응답
        res.status(200).json({
            message: '제한 약물 조회 성공',
            totalCount: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            list: list
        });
    } catch (error) {
        console.error("제한 약물 조회 컨트롤러 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
        next(error);
    }
};

exports.getRestrictedMediById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 ID입니다.' });
        }

        const medi = await RestrictService.getRestrictedMediById(id);
        if (!medi) {
            return res.status(404).json({ message: '제한 약물을 찾을 수 없습니다.' });
        }

        res.status(200).json({
            message: '제한 약물 상세 조회 성공',
            data: medi
        });
        console.log(medi);
    } catch (error) {
        console.error("제한 약물 상세 조회 컨트롤러 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
        next(error);
    }
}   
