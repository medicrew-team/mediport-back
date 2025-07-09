const User = require('./User');
const Board = require('./Board');
const Chronic_disease = require('./Chronic_disease'); // 여기
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

    //user와 기저질환 1:N
    User.hasMany(Chronic_disease, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Chronic_disease.belongsTo(User, { foreignKey: 'user_id' });
    //기저질환과 기저질환 금지약품 M:N
    Chronic_disease.hasMany(Disease_prohibit_medi, { foreignKey: 'chronic_disease_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Disease_prohibit_medi.belongsTo(Chronic_disease, { foreignKey: 'chronic_disease_id' });
    //기저질환 금지약품과 DUR-기저질환 M:N
    DUR_Chronic.hasMany(Disease_prohibit_medi, { foreignKey: 'dur_chronic_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Disease_prohibit_medi.belongsTo(DUR_Chronic, { foreignKey: 'dur_chronic_id' });
    
    //국제약품과 유사약품 1:M
    International_medi.hasMany(Similar_medi,{foreignKey:'International_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    Similar_medi.belongsTo(International_medi,{foreignKey:'International_medi_id'});
    //의약품과 유사약품 1:M
    KR_medi.hasMany(Similar_medi,{foreignKey:'KR_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    Similar_medi.belongsTo(KR_medi,{foreignKey:'KR_medi_id'});
    //의약품과 DUR_MEDI 1:M
    KR_medi.hasMany(DUR_medi,{foreignKey:'KR_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    DUR_medi.belongsTo(KR_medi,{foreignKey:'KR_medi_id'});

    console.log('모든 모델 관계가 설정되었습니다.');
}

module.exports= setupAssociations;
