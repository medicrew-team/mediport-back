const prescriptionService = require('../services/prescriptionService.js');
const fs = require('fs/promises');

exports.parseImage = async ( req, res ) => {
        const file = req.file;
        const target_lang = req.body.lang;
        
    try {
        if (!file) {
        return res.status(400).json({ message: 'file 필드가 필요합니다.' });
        }

        const result = await prescriptionService.parseImage( file, target_lang );

        return res.status(200).json( result );

    } catch ( error ) {
        console.log(error.message);  
        return res.status(500).json({ message: '서버 오류' }); 
    }
};
