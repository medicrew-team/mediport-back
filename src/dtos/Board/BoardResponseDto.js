class BoardResponseDto {
    constructor(board, author, commentCount = 0, likeCount = 0, comments = []) {
        this.board_id = board.board_id;
        this.title = board.title;
        this.content = board.content;
        this.view = board.view;
        this.createdAt = board.created_at;
        this.updatedAt = board.updated_at;
        this.author = author; // UserResponseDto 또는 간단한 객체
        this.commentCount = commentCount;
        this.likeCount = likeCount;
        this.comments = comments; // 상세 조회 시에만 포함
    }
}

module.exports = BoardResponseDto;