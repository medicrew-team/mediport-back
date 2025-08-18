const query = require('../utils/query');
const path   = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const OCR_URL = 'https://mediport-ai-dev.store/ocr/foreign-medicine';


exports.parseImage = async( file ) => {
    if ( !file ) throw new Error('file is required');
    
    try{
      const form = new FormData();
      form.append('file', fs.createReadStream(file.path), file.originalname);

      const { data } = await axios.post(OCR_URL, form, {
          headers: {
          ...form.getHeaders(),
          Authorization: 'Bearer your-token',
          },
      });
        console.log('data:', data);
        return data;
    } catch (error) {
      if (error.response) {
      console.error('status:', error.response.status, 'data:', error.response.data, 'loc:', error.response.data.detail?.[0]?.loc);
      throw new Error(`Upstream error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('network:', error.message);
      throw new Error('Upstream connection error');
    }
  }
};