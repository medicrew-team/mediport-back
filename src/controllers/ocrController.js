const ocrService = require('../services/ocrService.js');
const fs = require('fs/promises');

exports.parseImage = async ( req, res ) => {
        const file = req.file;
        console.log('1.file :', file);
    try {
        if (!file) {
        return res.status(400).json({ message: 'file 필드가 필요합니다.' });
        }

        const result = await ocrService.parseImage( file );
        return res.status(200).json( result );

    } catch ( error ) {
        console.log(error.message);  
        return res.status(500).json({ message: '서버 오류' }); 
    }
};