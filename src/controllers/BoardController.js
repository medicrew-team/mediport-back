const boardService = require('../services/BoardService');
const CreateBoardDto = require('../dtos/Board/CreateBoardDto');
const UpdateBoardDto = require('../dtos/Board/UpdateBoardDto');
const BoardResponseDto = require('../dtos/Board/BoardResponseDto');
const authorDto = require('../dtos/Board/authorDto'); // 작성자 정보 DTO
const CommentResponseDto = require('../dtos/Board/CommentResponseDto'); // 댓글 응답 DTO


class BoardController {
    async createBoard(req, res, next) {
        try {
            const userId = req.user.uid;
            const { title, content, categoryId } = req.body;
            const createBoardDto = new CreateBoardDto(title, content, categoryId);
            if (!createBoardDto.title || !createBoardDto.content) {
                return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
            }
    
            const newBoard = await boardService.createBoard(userId, createBoardDto);
    
            const author = new authorDto(req.user);
            const categoryDto = newBoard.Category 
                ? { id: newBoard.Category.category_id, name: newBoard.Category.category_name }
                : null;
    
            const boardResponse = new BoardResponseDto(newBoard, author, categoryDto);
    
            res.status(201).json({
                message: '게시글이 성공적으로 생성되었습니다.',
                board: boardResponse
            });
        } catch (error) {
            console.error("게시글 생성 에러: ", error);
            res.status(500).json({ message: error.message || '서버 에러' });
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
                const author = board.User ? new authorDto(board.User) : null;
                const commentCount = board.dataValues.commentCount || 0;
                const likeCount = board.dataValues.likeCount || 0;
                const categoryDto = board.Category ? { id: board.Category.category_id, name: board.Category.category_name } : null;
                return new BoardResponseDto(board,author,categoryDto,commentCount,likeCount);
            });

            res.status(200).json({
                message: '게시글 목록 조회 성공',
                totalItems: Array.isArray(count) ? count.length : count,
                totalPages: Math.ceil((Array.isArray(count) ? count.length : count) / limit),
                currentPage: page,
                boards: boardsResponse
            });
            console.log("게시글 목록 조회 성공: ", boardsResponse);
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
            const board = await boardService.getBoardById(boardId);
    
            const author = board.User ? new authorDto(board.User) : null;
            const commentCount = board.Comments ? board.Comments.length : 0;
            const likeCount = board.Likes ? board.Likes.length : 0;
            const comments = board.Comments
                ? board.Comments.map(c => new CommentResponseDto(c, c.User ? new authorDto(c.User) : null))
                : [];
            const categoryDto = board.Category
                ? { id: board.Category.category_id, name: board.Category.category_name }
                : null;
    
            const boardResponse = new BoardResponseDto(board, author, categoryDto, commentCount, likeCount, comments);
    
            res.status(200).json({
                message: '게시글 상세 조회 성공',
                board: boardResponse
            });
        } catch (error) {
            console.error("게시글 상세 조회 에러: ", error);
            const statusCode = error.message.includes('찾을 수 없습니다') ? 404 :
                               error.message.includes('권한이 없습니다') ? 403 : 500;
            res.status(statusCode).json({ message: error.message || '서버 에러' });
        }
    }

    async updateBoard(req, res, next) {
        try {
            const { boardId } = req.params;
            const userId = req.user.uid;
            const { title, content, categoryId } = req.body;
            
            const updateBoardDto = new UpdateBoardDto(title, content, categoryId);
            if (!updateBoardDto.title || !updateBoardDto.content) {
                return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
            }

            const updatedBoard = await boardService.updateBoard(boardId, userId, updateBoardDto);
            const boardResponse = new BoardResponseDto(updatedBoard, new authorDto(req.user)); // 작성자 정보 포함

            res.status(200).json({
                message: '게시글이 성공적으로 수정되었습니다.',
                board: boardResponse 
            });

            console.log("게시글 수정 성공: ", boardResponse);
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
            const author = req.user ? new authorDto(req.user) : null; // req.user는 Firebase decoded token
            const commentResponse = new CommentResponseDto(newComment, author);
            res.status(201).json({
                message: '댓글이 성공적으로 생성되었습니다.',
                comment: commentResponse
            });
            console.log("댓글 생성 성공: ", commentResponse);
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
            const author = req.user ? new authorDto(req.user) : null; // req.user는 Firebase decoded token
            const commentResponse = new CommentResponseDto(updatedComment, author);
            res.status(200).json({
                message: '댓글이 성공적으로 수정되었습니다.',
                comment: commentResponse
            });
            console.log("댓글 수정 성공: ", commentResponse);
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
            console.log("좋아요 상태 변경 성공: ", result);
        } catch (error) {
            console.error("좋아요 토글 에러: ", error);
            res.status(500).json({
                message: error.message || '서버 에러'
            });
        }
    }
}

module.exports = new BoardController();