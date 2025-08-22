class RegisterUserDto {
    constructor(user_id, email, username, nickname, phone, country, residence, gender, birthday, disease_ids, history, user_img) {
        this.user_id = user_id;
        this.email = email;
        this.username = username;
        this.nickname = nickname;
        this.phone = phone;
        this.gender = gender;
        this.country = country;
        this.region = residence;
        this.birthday = birthday;
        this.disease_ids = Array.isArray(disease_ids) ? disease_ids : [];
        this.history = Array.isArray(history) ? history : []; 
        this.user_img = user_img || null;
    }
}

module.exports = RegisterUserDto;