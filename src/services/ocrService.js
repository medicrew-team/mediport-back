const query = require('../utils/query');
const path   = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const OCR_URL = 'https://mediport-ai-dev.store/ocr/foreign-medicine';


exports.parseImage = async( file ) => {
    if ( !file ) throw new Error('file is required');
    
    const form = new FormData();
    
    try{
        const { data, status } = await axios.post(OCR_URL, form, {
            headers: {
            ...form.getHeaders()
            }
        });
        console.log(data);
        return data;
    } catch ( error ) {

    if (err.response) {

      console.error('status:', err.response.status, 'data:', err.response.data);
      // 그대로 throw해서 컨트롤러가 502/504 같은 걸 내려줄 수 있음
      throw new Error(`Upstream error: ${err.response.status}`);
    } else {

      console.error('network/timeout:', err.message);
      throw new Error('Upstream connection error');
    }

    }
};
