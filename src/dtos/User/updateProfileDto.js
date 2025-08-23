class updateProfileDto {
    constructor(phone,nickname,disease_ids,language,history,user_img) {
        this.phone = phone;
        this.nickname = nickname; // 닉네임, 기본값은 null
        this.disease_ids = Array.isArray(disease_ids) ? disease_ids : [];
        this.language = language || 'ko';
        this.history = Array.isArray(history) ? history : []; 
        this.user_img = user_img || null; // 프로필 이미지 URL, 기본값은 null
    }
}

module.exports = updateProfileDto;