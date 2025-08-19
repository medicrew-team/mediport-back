class UserResponseDto {
    constructor(user) {
        this.uid = user.user_id; 
        this.email = user.email;
        this.username = user.user_name;
        this.nickname = user.nickname
        this.phone = user.phone;
        this.country = user.country;
        this.residence = user.region;
        this.createdAt = user.created_at;
        this.diseases = user.Diseases ? user.Diseases.map(d => ({
            id: d.disease_id,
            name: d.disease_name
        })) : [];
    }
}

module.exports = UserResponseDto;