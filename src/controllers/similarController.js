const similarService = require('../services/similarService.js');
const fs = require('fs/promises');

exports.parseImage = async ( req, res ) => {
        const file = req.file;
        const id = req.user.uid;

    try {
        if (!file) {
        return res.status(400).json({ message: 'file 필드가 필요합니다.' });
        }

        const result = await similarService.parseImage( file, id );

        return res.status(200).json( result );

    } catch ( error ) {
        console.log(error.message);  
        return res.status(500).json({ message: '서버 오류' }); 
    }
};

exports.parseText = async ( req, res ) => {
    const text = req.body.text;
        const id = req.user.uid;

    try {
        if (!text) {
        return res.status(400).json({ message: 'text 필드가 필요합니다.' });
        }

        const result = await similarService.parseText( text, id );

        return res.status(200).json( result );

    } catch ( error ) {
        console.log(error.message);  
        return res.status(500).json({ message: '서버 오류' }); 
    }
};