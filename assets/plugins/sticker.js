const config = require("../../config");
const { command, isPrivate } = require("../../lib/");
command(
  {
    pattern: "sticker",
    fromMe: isPrivate,
    desc: "_Converts Photo or video to sticker_",
    type: "converter",
  },
  async (message, match, m) => {
    if (!(message.reply_message.video || message.reply_message.image))
      return await message.reply("_Reply to photo or video_");
    let buff = await m.quoted.download();
    message.sendMessage(message.jid,
      buff,
      { packname: config.PACKNAME, author: config.AUTHOR },
      "sticker"
    );
  }
);

command(
  {
    pattern: "take",
    fromMe: isPrivate,
    desc: "_Converts Photo or video to sticker_",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message.sticker)
      return await message.reply("_Reply to a sticker_");
   const  packname = match.split(';')[0]||config.PACKNAME
   const  author = match.split(';')[1]||config.AUTHOR
    let buff = await m.quoted.download();
    message.sendMessage(message.jid,
      buff,
      { packname,author },
      "sticker"
    );
  }
);
