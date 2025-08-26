
const chatbotService = require('../services/chatbotService.js');
const fs = require('fs/promises');

exports.chatbot = async ( req, res ) => {
        const user_input = req.body.user_input;
        const id = req.user.uid;
        
    try {
        if (!user_input) {
        return res.status(400).json({ message: 'text 필드가 필요합니다.' });
        }

        const result = await chatbotService.chatbot( user_input, id );

        return res.status(200).json( result );

    } catch ( error ) {
        console.log(error.message);  
        return res.status(500).json({ message: '서버 오류' }); 
    }
};
