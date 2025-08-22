const user = require('./user');
const board = require('./board');
const disease = require('./disease');
const user_disease = require('./user_disease');
const comment = require('./comment'); 
const dur_chronic = require('./dur_chronic');
const dur_medi = require('./dur_medi');
const international_medi = require('./international_medi');
const kr_medi = require('./kr_medi');
const like = require('./like');
const restricted_medi = require('./restricted_medi');
const similar_medi = require('./similar_medi');
const category = require('./category');
const user_medi_history = require('./user_medi_history');
// 2. 모델 관계 설정 함수 정의
function setupAssociations() {
    //user와 게시판 1:M
    user.hasMany(board, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    board.belongsTo(user, { foreignKey: 'user_id' });
    //게시판과 댓글 1:M
    board.hasMany(comment, { foreignKey: 'board_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    comment.belongsTo(board, { foreignKey: 'board_id' });
    //user와 댓글 1:M
    user.hasMany(comment, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    comment.belongsTo(user, { foreignKey: 'user_id' });
    //user와 추천 1:M
    user.hasMany(like,{foreignKey:'user_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
    like.belongsTo(user,{foreignKey:'user_id'})
    //board와 추천 1:M
    board.hasMany(like,{foreignKey:'board_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
    like.belongsTo(board,{foreignKey:'board_id'})
    //게시판과 카테고리 1:M
    board.belongsTo(category, { foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    category.hasMany(board, { foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });   
     
    //user와 kr_medi의 다대다 관계 설정
    user.belongsToMany(kr_medi, { through: user_medi_history, foreignKey: 'user_id' });
    kr_medi.belongsToMany(user, { through: user_medi_history, foreignKey: 'kr_medi_id' });

    // User ↔ UserMediHistory (1:N)
    user.hasMany(user_medi_history, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    user_medi_history.belongsTo(user, { foreignKey: 'user_id' });

    // Kr_medi ↔ UserMediHistory (1:N)
    kr_medi.hasMany(user_medi_history, { foreignKey: 'kr_medi_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
    user_medi_history.belongsTo(kr_medi, { foreignKey: 'kr_medi_id' });

    // user와 disease의 다대다 관계 설정
    user.belongsToMany(disease, { through: user_disease, foreignKey: 'user_id', as: 'Disease' });
    disease.belongsToMany(user, { through: user_disease, foreignKey: 'disease_id' });

    
    disease.hasMany(dur_chronic, { foreignKey: 'disease_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    dur_chronic.belongsTo(disease, { foreignKey: 'disease_id' });
    
    //국제약품과 유사약품 1:M
    international_medi.hasMany(similar_medi,{foreignKey:'international_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    similar_medi.belongsTo(international_medi,{foreignKey:'international_medi_id'});
    //의약품과 유사약품 1:M
    kr_medi.hasMany(similar_medi,{foreignKey:'kr_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    similar_medi.belongsTo(kr_medi,{foreignKey:'kr_medi_id'});
    //의약품과 dur_MEDI 1:M
    kr_medi.hasMany(dur_medi,{foreignKey:'kr_medi_id',onDelete: 'CASCADE',onUpdate:'CASCADE'});
    dur_medi.belongsTo(kr_medi,{foreignKey:'kr_medi_id'});

    console.log('모든 모델 관계가 설정되었습니다.');
}

module.exports= setupAssociations;
