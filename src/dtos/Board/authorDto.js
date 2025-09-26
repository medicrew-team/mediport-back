class authorDto {
    constructor(author) {
        this.id = author.user_id;
        this.user_img = author.user_img || null; // 프로필 이미지가 없을 경우 null 처리
        this.nickname = author.nickname || null;
        this.country = author.country || null;
        this.region = author.region   || null;
    }
}

module.exports = authorDto;