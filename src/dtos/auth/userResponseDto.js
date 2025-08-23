class UserResponseDto {
    constructor(user) {
        this.user_id = user.user_id; 
        this.email = user.email;
        this.username = user.user_name;
        this.nickname = user.nickname;
        this.gender = user.gender;
        this.birthday = user.birthday;
        this.phone = user.phone;
        this.country = user.country;
        this.residence = user.residence;
        this.createdAt = user.created_at;
        this.diseases = user.Disease ? user.Disease.map(d => ({
            id: d.disease_id
        })) : []
        this.history = user.UserMediHistories ? user.UserMediHistories.map(m => ({
            name: m.KrMedi ? m.KrMedi.prod_name : m.custom_name,
            start_date: m.start_date,
            end_date: m.end_date,
            status: m.status,
            dosage: m.dosage
        })) : [];
        this.user_img = user.user_img || null; // 기본값으로 null 설정
    }
}

module.exports = UserResponseDto;