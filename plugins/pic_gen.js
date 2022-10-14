const { command, isPrivate } = require("../lib");
const axios = require('axios');
command(
  {
    pattern: "picgen ?(.*)",
    fromMe: isPrivate,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    const axios = require('axios');

axios.post(
    'https://api.nlpcloud.io/v1/gpu/stable-diffusion/image-generation',
    {
        'text': match
    },
    {
        headers: {
            'Authorization': 'Token 60886faf693a7a2d33eedb3edf8aa2aad37dd0f4',
            'Content-Type': 'application/json'
        }
    }
).then(a=>message.sendFromUrl(a.data.url))
  }
);
