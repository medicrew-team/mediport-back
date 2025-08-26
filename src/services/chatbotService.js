const query = require('../utils/query.js');
const db    = require('../utils/db.js');
const path  = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const redisClient = require('../config/redisClient');

const ChatBot_URL = 'https://mediport-ai-dev.store/inference-v2';


exports.chatbot = async( user_input, id ) => {
    if ( !user_input ) throw new Error('user_input is required');
    
    try{
        const [rows] = await db.query(query.getLang, [ id ]);
        const target_lang = rows[0]?.language;     

      const { data } = await axios.post(ChatBot_URL,{
            user_input: user_input,
            lang: target_lang,
            }, {
          headers: {
          Authorization: 'Bearer your-token',
          },
      });
      
       await db.query(query.historyUser, [ id, 'user', user_input ]);

       const {result} = data;
       await db.query(query.historyBot, [ id, 'bot', result ]);

       const [history] = await db.query(query.showHistory, [ id ]);
       return history;

        
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

