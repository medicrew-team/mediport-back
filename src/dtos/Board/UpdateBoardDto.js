class UpdateBoardDto {
    constructor(title, content, category) {
        this.title = title;
        this.content = content;
        this.category = category;
    }
}

module.exports = UpdateBoardDto;