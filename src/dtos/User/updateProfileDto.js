class updateProfileDto {
    constructor(username, phone, country, disease_ids) {
        this.username = username;
        this.phone = phone;
        this.country = country;
        this.disease_ids = disease_ids;
    }
}

module.exports = updateProfileDto;