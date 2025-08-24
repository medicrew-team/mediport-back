class CreateBoardDto {
    constructor(title, content, categoryId) {
        this.title = title;
        this.content = content;
        this.categoryId = categoryId;
    }
}

module.exports = CreateBoardDto;