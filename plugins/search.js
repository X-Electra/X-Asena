const { alpha, isPrivate, weather } = require("../lib");
const gis = require('g-i-s');

alpha(
    {
      pattern: "google",
      fromMe: isPrivate,
      desc: "Download audio from youtube",
      type: "search"
    },
    async (message, match) => {
      text = match || message.reply_message.text;
      if (!text) return message.reply('*give me a query*');
      let google = require('google-it');
        google({ 'query': text}).then(res => {
            let msg= `_*Google Top Search Resuts For Query : ${text}*_\n\n`;
            for (let g of res) {
                msg+= `*➣ Title :* ${g.title}\n`;
                msg+= `*➣ Description :* ${g.snippet}\n`;
                msg+= `*➣ Link :* ${g.link}\n\n────────────────────────\n\n`;
            }
         
            return message.reply(msg);
        })
    }
);

alpha(
    {
      pattern: "gis",
      fromMe: isPrivate,
      desc: "search google for random images",
      type: "search",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.sendMessage(message.jid, "Provide a text");
      gis(match, async (error, images) => {
        if (error) {
          console.error(error);
          return await message.reply("An error occurred while searching for images.");
        }
        if (images && images.length > 0) {
            const randomIndex = Math.floor(Math.random() * images.length);
            const imageUrl = images[randomIndex].url;
            console.log(images)
            return await message.sendMessage(
              message.jid,
              imageUrl,
              {
                mimetype: "image/jpeg",
                caption: "```Alpha g-i-s Interface```",
              },
              "image"
            );
          } else {
          return await message.reply("```No images found for the given search query.```");
        }
      });
    }
  );

  alpha(
    {
      pattern: "weather",
      fromMe: isPrivate,
      desc: "Download audio from youtube",
      type: "search"
    },
    async (m, match) => {
      match = match || message.reply_message.text;
      return await weather(m); 
    }
);