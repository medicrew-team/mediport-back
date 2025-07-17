const boardService = require('../services/BoardService');
const CreateBoardDto = require('../dtos/Board/CreateBoardDto');
const UpdateBoardDto = require('../dtos/Board/UpdateBoardDto');
const BoardResponseDto = require('../dtos/Board/BoardResponseDto');
const UserResponseDto = require('../dtos/auth/userResponseDto'); // 작성자 정보 DTO
const CommentResponseDto = require('../dtos/Board/CommentResponseDto'); // 댓글 응답 DTO

class BoardController {
    async createBoard(req, res, next) {
        try {
            const userId = req.user.uid;
            const { title, content, category } = req.body;

            // DTO를 사용하여 유효성 검사 및 데이터 캡슐화
            const createBoardDto = new CreateBoardDto(title, content, category);
            if (!createBoardDto.title || !createBoardDto.content) {
                return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
            }

            const newBoard = await boardService.createBoard(userId, createBoardDto);

            res.status(201).json({
                message: '게시글이 성공적으로 생성되었습니다.',
                board: new BoardResponseDto(newBoard, new UserResponseDto(req.user)) // 작성자 정보 포함
            });
        } catch (error) {
            console.error("게시글 생성 에러: ", error);
            res.status(500).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async getBoards(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const search = req.query.search || null;
            const category = req.query.category || null;

            const { count, rows } = await boardService.getBoards(page, limit, search, category);

            const boardsResponse = rows.map(board => {
                const author = board.User ? new UserResponseDto(board.User) : null;
                const commentCount = board.dataValues.commentCount || 0;
                const likeCount = board.dataValues.likeCount || 0;
                return new BoardResponseDto(board, author, commentCount, likeCount);
            });

            res.status(200).json({
                message: '게시글 목록 조회 성공',
                totalItems: count.length, // count is an array of objects with board_id and count
                totalPages: Math.ceil(count.length / limit),
                currentPage: page,
                boards: boardsResponse
            });
        } catch (error) {
            console.error("게시글 목록 조회 에러: ", error);
            res.status(500).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async getBoardById(req, res, next) {
        try {
            const { boardId } = req.params;
            const { category } = req.query; 
            const board = await boardService.getBoardById(boardId,category);
            const author = board.User ? new UserResponseDto(board.User) : null;
            const commentCount = board.Comments ? board.Comments.length : 0;
            const likeCount = board.Likes ? board.Likes.length : 0;
            const comments = board.Comments ? board.Comments.map(comment => new CommentResponseDto(comment, comment.User ? new UserResponseDto(comment.User) : null)) : [];

            const boardResponse = new BoardResponseDto(board, author, commentCount, likeCount, comments);
            console.log("게시글 상세 조회 성공: ", boardResponse);
            res.status(200).json({
                message: '게시글 상세 조회 성공',
                board: boardResponse
            });
        } catch (error) {
            console.log("boardId",req.params.boardId);
            console.error("게시글 상세 조회 에러: ", error);
            const statusCode = error.message.includes('찾을 수 없습니다') ? 404 :
                               error.message.includes('권한이 없습니다') ? 403 : 500;
            res.status(statusCode).json({
                message: error.message || '서버 에러'
            });
        }l
    }

    async updateBoard(req, res, next) {
        try {
            const { boardId } = req.params;
            const userId = req.user.uid;
            const { title, content, category } = req.body;

            const updateBoardDto = new UpdateBoardDto(title, content, category);
            if (!updateBoardDto.title || !updateBoardDto.content) {
                return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
            }

            const updatedBoard = await boardService.updateBoard(boardId, userId, updateBoardDto);

            res.status(200).json({
                message: '게시글이 성공적으로 수정되었습니다.',
                board: new BoardResponseDto(updatedBoard, new UserResponseDto(req.user)) // 수정 후 작성자 정보 포함
            });
        } catch (error) {
            console.error("게시글 수정 에러: ", error);
            const statusCode = error.message.includes('찾을 수 없습니다') ? 404 :
                               error.message.includes('권한이 없습니다') ? 403 : 500;
            res.status(statusCode).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async deleteBoard(req, res, next) {
        try {
            const { boardId } = req.params;
            const userId = req.user.uid;

            const result = await boardService.deleteBoard(boardId, userId);

            res.status(200).json(result);
        } catch (error) {
            console.error("게시글 삭제 에러: ", error);
            const statusCode = error.message.includes('찾을 수 없습니다') ? 404 :
                               error.message.includes('권한이 없습니다') ? 403 : 500;
            res.status(statusCode).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async createComment(req, res, next) {
        try {
            const { boardId } = req.params;
            const userId = req.user.uid;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ message: '댓글 내용은 필수입니다.' });
            }

            const newComment = await boardService.createComment(boardId, userId, content);

            // CommentResponseDto 적용
            const author = req.user ? new UserResponseDto(req.user) : null; // req.user는 Firebase decoded token
            res.status(201).json({
                message: '댓글이 성공적으로 생성되었습니다.',
                comment: new CommentResponseDto(newComment, author)
            });
        } catch (error) {
            console.error("댓글 생성 에러: ", error);
            res.status(500).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async updateComment(req, res, next) {
        try {
            const { boardId, commentId } = req.params;
            const userId = req.user.uid;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ message: '댓글 내용은 필수입니다.' });
            }

            const updatedComment = await boardService.updateComment(boardId, commentId, userId, content);

            // CommentResponseDto 적용
            const author = req.user ? new UserResponseDto(req.user) : null; // req.user는 Firebase decoded token
            res.status(200).json({
                message: '댓글이 성공적으로 수정되었습니다.',
                comment: new CommentResponseDto(updatedComment, author)
            });
        } catch (error) {
            console.error("댓글 수정 에러: ", error);
            const statusCode = error.message.includes('찾을 수 없습니다') ? 404 :
                               error.message.includes('권한이 없습니다') ? 403 : 500;
            res.status(statusCode).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async deleteComment(req, res, next) {
        try {
            const { boardId, commentId } = req.params;
            const userId = req.user.uid;

            const result = await boardService.deleteComment(boardId, commentId, userId);

            res.status(200).json(result);
        } catch (error) {
            console.error("댓글 삭제 에러: ", error);
            const statusCode = error.message.includes('찾을 수 없습니다') ? 404 :
                               error.message.includes('권한이 없습니다') ? 403 : 500;
            res.status(statusCode).json({
                message: error.message || '서버 에러'
            });
        }
    }

    async toggleLike(req, res, next) {
        try {
            const { boardId } = req.params;
            const userId = req.user.uid;

            const result = await boardService.toggleLike(boardId, userId);

            res.status(200).json(result);
        } catch (error) {
            console.error("좋아요 토글 에러: ", error);
            res.status(500).json({
                message: error.message || '서버 에러'
            });
        }
    }
}

module.exports = new BoardController();