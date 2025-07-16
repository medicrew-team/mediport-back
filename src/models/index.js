const User = require('./User');
const Board = require('./Board');
const Disease = require('./Disease');
const User_Disease = require('./User_Disease');
const Comment = require('./Comment');
const Disease_prohibit_medi = require('./Disease_prohibit_medi'); // 여기
const DUR_Chronic = require('./DUR_Chronic');
const DUR_medi = require('./DUR_medi');
const International_medi = require('./International_medi');
const KR_medi = require('./KR_medi');
const Like = require('./Like');
const Restricted_medi = require('./Restricted_medi');
const Similar_medi = require('./Similar_medi');

// 2. 모델 관계 설정 함수 정의
function setupAssociations() {
    //user와 게시판 1:M
    User.hasMany(Board, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Board.belongsTo(User, { foreignKey: 'user_id' });
    //게시판과 댓글 1:M
    Board.hasMany(Comment, { foreignKey: 'board_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Comment.belongsTo(Board, { foreignKey: 'board_id' });
    //user와 댓글 1:M
    User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Comment.belongsTo(User, { foreignKey: 'user_id' });
    //user와 추천 1:M
    User.hasMany(Like,{foreignKey:'user_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
    Like.belongsTo(User,{foreignKey:'user_id'})
    //Board와 추천 1:M
    Board.hasMany(Like,{foreignKey:'board_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
    Like.belongsTo(Board,{foreignKey:'board_id'})

    // User와 Disease의 다대다 관계 설정
    User.belongsToMany(Disease, { through: User_Disease, foreignKey: 'user_id' });
    Disease.belongsToMany(User, { through: User_Disease, foreignKey: 'disease_id' });

    //Disease와 Disease_prohibit_medi 1:M
    Disease.hasMany(Disease_prohibit_medi, { foreignKey: 'disease_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Disease_prohibit_medi.belongsTo(Disease, { foreignKey: 'disease_id' });

    //기저질환 금지약품과 DUR-기저질환 M:N
    DUR_Chronic.hasMany(Disease_prohibit_medi, { foreignKey: 'dur_chronic_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Disease_prohibit_medi.belongsTo(DUR_Chronic, { foreignKey: 'dur_chronic_id' });
    
    //국제약품과 유사약품 1:M
    International_medi.hasMany(Similar_medi,{foreignKey:'International_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    Similar_medi.belongsTo(International_medi,{foreignKey:'International_medi_id'});
    //의약품과 유사약품 1:M
    KR_medi.hasMany(Similar_medi,{foreignKey:'kr_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    Similar_medi.belongsTo(KR_medi,{foreignKey:'kr_medi_id'});
    //의약품과 DUR_MEDI 1:M
    KR_medi.hasMany(DUR_medi,{foreignKey:'kr_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    DUR_medi.belongsTo(KR_medi,{foreignKey:'kr_medi_id'});

    console.log('모든 모델 관계가 설정되었습니다.');
}

module.exports= setupAssociations;
