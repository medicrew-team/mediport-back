//
const getBoardById = 
`SELECT * FROM Board WHERE board_id = :boardId AND category = :category order by created_at ASC`;

module.exports = {
    getBoardById
};