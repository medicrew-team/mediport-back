class RegisterUserDto {
    constructor(firebaseUid, email, username, nickname, phone, country, residence, gender, birthday, disease_ids, history, user_img) {
        this.firebaseUid = firebaseUid;
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