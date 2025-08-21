const express = require('express');
const router = express.Router();
const boardController = require('../controllers/BoardController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: board
 *   description: 게시판 정보 관련 API
 */


/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: 모든 게시글 조회
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BoardResponseDto'
 */
/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: 모든 게시글 조회
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BoardResponseDto'
 */
router.get('/',verifyToken ,boardController.getBoards);
/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: 새 게시글 생성
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBoardDto'
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponseDto'
 *       400:
 *         description: 잘못된 요청
 */
/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: 새 게시글 생성
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBoardDto'
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponseDto'
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', verifyToken, boardController.createBoard);


/**
 * @swagger
 * /api/boards/{boardId}:
 *   get:
 *     summary: 특정 게시글 조회
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponseDto'
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
/**
 * @swagger
 * /api/boards/{boardId}:
 *   get:
 *     summary: 특정 게시글 조회
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponseDto'
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.get('/:boardId',verifyToken ,boardController.getBoardById);
/**
 * @swagger
 * /api/boards/{boardId}:
 *   put:
 *     summary: 특정 게시글 업데이트
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBoardDto'
 *     responses:
 *       200:
 *         description: 게시글 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponseDto'
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
/**
 * @swagger
 * /api/boards/{boardId}:
 *   put:
 *     summary: 특정 게시글 업데이트
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBoardDto'
 *     responses:
 *       200:
 *         description: 게시글 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponseDto'
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.put('/:boardId', verifyToken, boardController.updateBoard);
/**
 * @swagger
 * /api/boards/{boardId}:
 *   delete:
 *     summary: 특정 게시글 삭제
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       204:
 *         description: 게시글 삭제 성공
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.delete('/:boardId', verifyToken, boardController.deleteBoard);


/**
 * @swagger
 * /api/boards/{boardId}/comments:
 *   post:
 *     summary: 게시글에 댓글 추가
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponseDto'
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.post('/:boardId/comments', verifyToken, boardController.createComment);


/**
 * @swagger
 * /api/boards/{boardId}/comments/{commentId}:
 *   put:
 *     summary: 특정 댓글 업데이트
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 업데이트할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponseDto'
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.put('/:boardId/comments/:commentId', verifyToken, boardController.updateComment);
/**
 * @swagger
 * /api/boards/{boardId}/comments/{commentId}:
 *   delete:
 *     summary: 특정 댓글 삭제
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     responses:
 *       204:
 *         description: 댓글 삭제 성공
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.delete('/:boardId/comments/:commentId', verifyToken, boardController.deleteComment);


/**
 * @swagger
 * /api/boards/{boardId}/likes:
 *   post:
 *     summary: 게시글 좋아요/좋아요 취소
 *     tags: [board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.post('/:boardId/likes', verifyToken, boardController.toggleLike);

module.exports = router;