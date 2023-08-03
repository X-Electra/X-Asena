const toggle = require("../assets/database/options");
const { command, parsedJid } = require("../lib/");
const axios = require('axios')



//const api_key = 'api-key'

const api_key = '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'

command(
  {
    pattern: "gpt",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "Util",
  },
  async (message, match, m) => {
    if(!match) return message.reply('ask something') 

const response = await axios.post(
  'https://api.openai.com/v1/chat/completions',
  {
    'model': "whisper-1",
    'messages': [
      {
        'role': 'user',
        'content':match
      }
    ],
    'temperature': 0.7
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + api_key
    }
  }
);
console.log(JSON.stringify(response.data));
  }
);
