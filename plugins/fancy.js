
const { command, styletext, listall, tiny, isPrivate } = require("../lib/");
const axios = require("axios");
/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "fancy",
    fromMe: isPrivate,
    desc: "converts text to fancy text",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.text || !match ||isNaN(match)) {
      let text = tiny(
        "Fancy text generator\n\nReply to a message\nExample: .fancy 32\n\n"
      );
      listall("Fancy").forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
      return await message.reply(text);
    } else {
      message.reply(styletext(message.reply_message.text, parseInt(match)));
    }
  }
);
command(
  {
    pattern: "quotely",
    fromMe: isPrivate,
    desc: "makes sticker of text.",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.text) return await message.reply('Please quote any users message.');
      let pfp;
            try {
                pfp = await message.client.profilePictureUrl(message.reply_message.participant, "image");
            } catch (e) {
                pfp = 'https://avatars.githubusercontent.com/u/95992247?v=4';
            }
            let todlinkf = ["#FFFFFF", "#000000"];
            let todf = todlinkf[Math.floor(Math.random() * todlinkf.length)];
            var tname
            try{
                tname = message.getName(message.reply_message.participant)
            } catch (e) {
                tname = "X-Asena"
            }
            let body = {
                type: "quote",
                format: "png",
                backgroundColor: todf,
                width: 512,
                height: 512,
                scale: 3,
                messages: [{
                    avatar: true,
                    from: {
                        first_name: tname,
                        language_code: "en",
                        name: tname,
                        photo: {
                            url: pfp,
                        },
                    },
                    text: message.reply_message.text,
                    replyMessage: {},
                }, ],
            };
            let res = await axios.post("https://bot.lyo.su/quote/generate", body);
            let img = Buffer.alloc(res.data.result.image.length, res.data.result.image, "base64");
            return message.sendMessage(img,{packname:'X-Asena',author:'Quotely'},"sticker")
  }
);
