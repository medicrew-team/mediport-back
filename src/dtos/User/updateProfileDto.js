class updateProfileDto {
    constructor(phone,nickname,language,user_img) {
        this.phone = phone;
        this.nickname = nickname; // 닉네임, 기본값은 null
        this.language = language || 'ko';
        this.user_img = user_img || null; // 프로필 이미지 URL, 기본값은 null
    }
}

module.exports = updateProfileDto;