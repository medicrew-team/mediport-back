const query = require('../utils/query.js');
const db    = require('../utils/db.js');
const path  = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const redisClient = require('../config/redisClient');

const ChatBot_URL = 'https://mediport-ai-dev.store/inference-v2';


exports.chatbot = async( user_input, target_lang='ko' ) => {
    if ( !user_input ) throw new Error('user_input is required');
    
    try{
      
      const { data } = await axios.post(ChatBot_URL,{
            user_input: user_input,
            lang: target_lang,
            }, {
          headers: {
          Authorization: 'Bearer your-token',
          },
      });
        return data;
        
    } catch (error) {
    if (error.response) {
      console.error('status:', error.response.status, 'data:', error.response.data);
      throw new Error(`Upstream error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('network:', error.message);
      throw new Error('Upstream connection error');
    }
  }
};

