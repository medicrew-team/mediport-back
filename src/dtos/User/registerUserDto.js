class RegisterUserDto {
    constructor(firebaseUid,email,username,nickname ,phone, country,residence,gender,birthday,disease_ids,user_img) {
        this.firebaseUid = firebaseUid;
        this.email = email;
        this.username = username;
        this.nickname = nickname;
        this.phone = phone;
        this.gender = gender;
        this.country = country;
        this.region = residence;
        this.birthday = birthday;
        this.disease_ids = disease_ids;
        this.user_img = user_img || null; // 기본값으로 null 설정
    }
}

module.exports = RegisterUserDto;