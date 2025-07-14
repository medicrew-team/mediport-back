class CreateBoardDto {
    constructor(title, content, category) {
        this.title = title;
        this.content = content;
        this.category = category;
    }
}

module.exports = CreateBoardDto;