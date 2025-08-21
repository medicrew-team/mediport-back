class updateProfileDto {
    constructor(phone,nickname,disease_ids,language,img,medi_history) {
        this.phone = phone;
        this.nickname = nickname; // 닉네임, 기본값은 null
        this.disease_ids = disease_ids;
        this.language = language || 'ko';
        this.img = img || null; // 프로필 이미지 URL, 기본값은 null
        this.medi_history = medi_history || []; // 약물 복용 이력, 기본값은 빈 배열
    }
}

module.exports = updateProfileDto;