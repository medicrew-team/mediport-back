const { sequelize, Op } = require('../config/sequelize');
const Board = require('../models/board');
const User = require('../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like');
const Category = require('../models/category');

class BoardService {
    async createBoard(userId, boardDto) {
        try {
            const newBoard = await Board.create({
                title: boardDto.title,
                content: boardDto.content,
                user_id: userId,
                category_id: boardDto.categoryId   // category_id 저장
            });
            const boardWithCategory = await Board.findByPk(newBoard.board_id, 
            {
                include: [
                    { model: User, attributes: ['user_id', 'nickname', 'country', 'user_img', 'region'] },
                    {
                        model: Category,
                        attributes: ['category_id', 'category_name']
                    }
                ]
            });
            return boardWithCategory;
        } catch (error) {
            console.error('게시글 생성 에러 : ', error);
            throw new Error(`게시글 생성 실패: ${error.message}`);
        }
    }

    async getBoards(page, limit, search, categoryId) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};
    
            if (search) {
                whereClause[Op.or] = [
                    { title: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ];
            }
    
            if (categoryId) {
                whereClause.category_id = categoryId;  // FK 기준으로 검색
            }
    
            const boards = await Board.findAndCountAll({
                where: whereClause,
                attributes: {
                    include: [
                        [sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("comments.comment_id"))), "commentCount"],
                        [sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("likes.like_id"))), "likeCount"]
                    ]
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'nickname', 'country', 'user_img', 'region']
                    },
                    { model: Comment, attributes: [] },
                    { model: Like, attributes: [] },
                    { model: Category, attributes: ['category_id', 'category_name'] }
                ],
                group: ['board.board_id'],
                order: [['created_at', 'DESC']],
                offset,
                limit,
                subQuery: false
            });
    
            return boards;
        } catch (error) {
            console.error('게시글 목록 조회 에러 : ', error);
            throw new Error(`게시글 목록 조회 실패: ${error.message}`);
        }
    }

    async getBoardById(boardId) {
        try {
            const board = await Board.findOne({
                where: { board_id: boardId },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ]
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ] 
                        }
                    },
                    {
                        model: Like,
                        include: {
                            model: User,
                            attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ] 
                        }
                    },
                    {
                        model: Category,
                        attributes: ['category_id', 'category_name']
                    }
                ],
                order: [[Comment, 'created_at', 'ASC']]
            });

            if (!board) {
                throw new Error('게시글을 찾을 수 없습니다.');
            }

            // 조회수 1 증가
            await board.increment('view');

            return board;
        } catch (error) {
            console.error('게시글 상세 조회 에러 : ', error);
            throw new Error(`게시글 상세 조회 실패: ${error.message}`);
        }
    }

    async updateBoard(boardId, userId, updateData) {
        try {
            const board = await Board.findByPk(boardId);
    
            if (!board) throw new Error('게시글을 찾을 수 없습니다.');
            if (board.user_id !== userId) throw new Error('게시글을 수정할 권한이 없습니다.');
    
            board.title = updateData.title || board.title;
            board.content = updateData.content || board.content;
            board.category_id = updateData.categoryId || board.category_id;  // FK 수정
            await board.save();

            const updateBoard = await Board.findOne({
                where: { board_id: boardId },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ]
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ] 
                        }
                    },
                    {
                        model: Like,
                        include: {
                            model: User,
                            attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ] 
                        }
                    },
                    {
                        model: Category,
                        attributes: ['category_id', 'category_name']
                    }
                ],
                order: [[Comment, 'created_at', 'ASC']]
            });
            return updateBoard;
        } catch (error) {
            console.error('게시글 수정 에러 : ', error);
            throw new Error(`게시글 수정 실패: ${error.message}`);
        }
    }

    async deleteBoard(boardId, userId) {
        try {
            const board = await Board.findByPk(boardId);

            if (!board) {
                throw new Error('게시글을 찾을 수 없습니다.');
            }

            if (board.user_id !== userId) {
                throw new Error('게시글을 삭제할 권한이 없습니다.');
            }

            await board.destroy();

            return { message: '게시글이 성공적으로 삭제되었습니다.' };
        } catch (error) {
            console.error('게시글 삭제 에러 : ', error);
            throw new Error(`게시글 삭제 실패: ${error.message}`);
        }
    }

    async createComment(boardId, userId, content) {
        try {
            const newComment = await Comment.create({
                board_id: boardId,
                user_id: userId,
                content: content
            });

            const commentWithUser = await Comment.findByPk(newComment.comment_id, {
                include: [
                    { model: User, attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ] }
                ]
            });
    
            return commentWithUser;
        } catch (error) {
            console.error('댓글 생성 에러 : ', error);
            throw new Error(`댓글 생성 실패: ${error.message}`);
        }
    }

    async updateComment(boardId, commentId, userId, content) {
        try {
            const comment = await Comment.findOne({
                where: {
                    comment_id: commentId,
                    board_id: boardId
                }
            });

            if (!comment) {
                throw new Error('댓글을 찾을 수 없습니다.');
            }

            if (comment.user_id !== userId) {
                throw new Error('댓글을 수정할 권한이 없습니다.');
            }

            comment.content = content;
            await comment.save();

            const commentWithUser = await Comment.findByPk(newComment.comment_id, {
                include: [
                    { model: User, attributes: ['user_id', 'nickname','email', 'phone', 'country','region','user_img' ] }
                ]
            });
            return commentWithUser;
        } catch (error) {
            console.error('댓글 수정 에러 : ', error);
            throw new Error(`댓글 수정 실패: ${error.message}`);
        }
    }

    async deleteComment(boardId, commentId, userId) {
        try {
            const comment = await Comment.findOne({
                where: {
                    comment_id: commentId,
                    board_id: boardId
                }
            });

            if (!comment) {
                throw new Error('댓글을 찾을 수 없습니다.');
            }

            if (comment.user_id !== userId) {
                throw new Error('댓글을 삭제할 권한이 없습니다.');
            }

            await comment.destroy();

            return { message: '댓글이 성공적으로 삭제되었습니다.' };
        } catch (error) {
            console.error('댓글 삭제 에러 : ', error);
            throw new Error(`댓글 삭제 실패: ${error.message}`);
        }
    }

    async toggleLike(boardId, userId) {
        try {
            const existingLike = await Like.findOne({
                where: {
                    board_id: boardId,
                    user_id: userId
                }
            });

            if (existingLike) {
                // 이미 좋아요를 눌렀다면, 좋아요 취소
                await existingLike.destroy();
                return { liked: false, message: '좋아요가 취소되었습니다.' };
            } else {
                // 좋아요를 누르지 않았다면, 좋아요 추가
                await Like.create({
                    board_id: boardId,
                    user_id: userId
                });
                return { liked: true, message: '좋아요가 추가되었습니다.' };
            }
        } catch (error) {
            console.error('좋아요 토글 에러 : ', error);
            throw new Error(`좋아요 처리 실패: ${error.message}`);
        }
    }
}

module.exports = new BoardService();