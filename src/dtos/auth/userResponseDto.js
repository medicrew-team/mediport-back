class UserResponseDto {
    constructor(user) {
        this.uid = user.user_id; 
        this.email = user.email;
        this.username = user.user_name;
        this.nickname = user.nickname;
        this.gender = user.gender;
        this.birthday = user.birthday;
        this.phone = user.phone;
        this.country = user.country;
        this.residence = user.region;
        this.createdAt = user.created_at;
        this.diseases = user.Diseases ? user.Diseases.map(d => ({
            id: d.disease_id,
            name: d.disease_name
        })) : []
        this.user_medi_history = user.User_Medi_History ? user.User_Medi_History.map(m => ({
            id: m.medi_id,
            name: m.medi_name
        })) : [];
        this.userImg = user.user_img || null; // 기본값으로 null 설정
    }
}

module.exports = UserResponseDto;