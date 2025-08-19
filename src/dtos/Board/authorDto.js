class authorDto {
    constructor(author) {
        this.id = author.user_id;
        this.profileImage = author.user_img || null; // 프로필 이미지가 없을 경우 null 처리
        this.nickname = author.nickname;
        this.country = author.country;
        this.region = author.region;
    }
}

module.exports = authorDto;