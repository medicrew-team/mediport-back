class CommentResponseDto {
    constructor(comment, author) {
        this.comment_id = comment.comment_id;
        this.content = comment.content;
        this.createdAt = comment.created_at;
        this.updatedAt = comment.updated_at;
        this.author = author; // UserResponseDto
    }
}

module.exports = CommentResponseDto;