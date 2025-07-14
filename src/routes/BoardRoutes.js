const express = require('express');
const router = express.Router();
const boardController = require('../controllers/BoardController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: 게시판 관련 API
 */

/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Boards]
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
 *         description: 페이지 당 게시글 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색 키워드 (제목 또는 내용)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리 필터링
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글 목록 조회 성공
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 boards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BoardResponseDto'
 *       500:
 *         description: 서버 에러
 *   post:
 *     summary: 새 게시글 생성
 *     tags: [Boards]
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 성공적으로 생성되었습니다.
 *                 board:
 *                   $ref: '#/components/schemas/BoardResponseDto'
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 등)
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       500:
 *         description: 서버 에러
 */
router.get('/', boardController.getBoards);
router.post('/', verifyToken, boardController.createBoard);

/**
 * @swagger
 * /api/boards/{boardId}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글 상세 조회 성공
 *                 board:
 *                   $ref: '#/components/schemas/BoardResponseDto'
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *   put:
 *     summary: 게시글 수정
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBoardDto'
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 성공적으로 수정되었습니다.
 *                 board:
 *                   $ref: '#/components/schemas/BoardResponseDto'
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 등)
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/:boardId', boardController.getBoardById);
router.put('/:boardId', verifyToken, boardController.updateBoard);
router.delete('/:boardId', verifyToken, boardController.deleteBoard);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */

/**
 * @swagger
 * /api/boards/{boardId}/comments:
 *   post:
 *     summary: 댓글 생성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 댓글을 작성할 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *             required:
 *               - content
 *             example:
 *               content: "이것은 새로운 댓글입니다."
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 댓글이 성공적으로 생성되었습니다.
 *                 comment:
 *                   $ref: '#/components/schemas/CommentResponseDto'
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 등)
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       500:
 *         description: 서버 에러
 */
router.post('/:boardId/comments', verifyToken, boardController.createComment);

/**
 * @swagger
 * /api/boards/{boardId}/comments/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 댓글이 속한 게시글 ID
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *             required:
 *               - content
 *             example:
 *               content: "수정된 댓글 내용입니다."
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 댓글이 성공적으로 수정되었습니다.
 *                 comment:
 *                   $ref: '#/components/schemas/CommentResponseDto'
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 등)
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 댓글이 속한 게시글 ID
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 댓글이 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.put('/:boardId/comments/:commentId', verifyToken, boardController.updateComment);
router.delete('/:boardId/comments/:commentId', verifyToken, boardController.deleteComment);

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: 좋아요 관련 API
 */

/**
 * @swagger
 * /api/boards/{boardId}/likes:
 *   post:
 *     summary: 게시글 좋아요 토글 (좋아요/좋아요 취소)
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 좋아요를 누르거나 취소할 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   description: 좋아요 상태 (true: 좋아요, false: 좋아요 취소)
 *                 message:
 *                   type: string
 *                   example: 좋아요가 추가되었습니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       500:
 *         description: 서버 에러
 */
router.post('/:boardId/likes', verifyToken, boardController.toggleLike);

module.exports = router;