class RegisterUserDto {
    constructor(username,nickname ,phone, country,region,gender,birthday,disease_ids) {
        this.username = username;
        this.nickname = nickname;
        this.phone = phone;
        this.gender = gender;
        this.country = country;
        this.region = region;
        this.birthday = birthday;
        this.disease_ids = disease_ids;

    }
}

module.exports = RegisterUserDto;