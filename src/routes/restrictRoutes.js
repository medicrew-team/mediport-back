const express = require('express');
const router = express.Router();
const restrictController = require('../controllers/restrictController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Restrict
 *   description: 제한 약물 정보 관련 API
 */

/**
 * @swagger
 * /api/restricts:
 *   get:
 *     summary: 제한 약물 목록 조회
 *     description: 페이지네이션과 검색 기능을 통해 제한 약물 목록을 조회합니다.
 *     tags: [Restrict]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지 당 표시할 항목 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (약물 이름 또는 성분)
 *     responses:
 *       200:
 *         description: 제한 약물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 제한 약물 조회 성공
 *                 totalCount:
 *                   type: integer
 *                   example: 125
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 13
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       restricted_medi_id:
 *                         type: integer
 *                       prod_name:
 *                         type: string
 *                       ing_name:
 *                         type: string
 *                       company_name:
 *                         type: string
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.get('/', verifyToken, restrictController.getRestrictedMedis);


/**
 * @swagger
 * /api/restricts/{id}:
 *   get:
 *     summary: 특정 제한 약물 조회
 *     description: ID로 제한 약물을 조회합니다.
 *     tags: [Restrict]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 제한 약물 ID
 *     responses:
 *       200:
 *         description: 제한 약물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 제한 약물 조회 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     restricted_medi_id:
 *                       type: integer
 *                     prod_name:
 *                       type: string
 *                     ing_name:
 *                       type: string
 *                     company_name:
 *                       type: string
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.get('/:id', verifyToken, restrictController.getRestrictedMediById);
module.exports = router;
