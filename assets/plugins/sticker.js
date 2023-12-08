const config = require("../../config");
const { command, isPrivate,toAudio} = require("../../lib/");
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
    message.sendMessage(
      message.jid,
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
    const packname = match.split(";")[0] || config.PACKNAME;
    const author = match.split(";")[1] || config.AUTHOR;
    let buff = await m.quoted.download();
    message.sendMessage(message.jid, buff, { packname, author }, "sticker");
  }
);

command(
  {
    pattern: "photo",
    fromMe: true,
    desc: "Changes sticker to Photo",
    type: "converter",
  },
  async (message, match, m) => {
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not a sticker_");
    let buff = await m.quoted.download();
    return await message.sendMessage(message.jid,buff, {}, "image");
  }
);

command(
  {
    pattern: "mp3 ?(.*)",
    fromMe: true,
    desc: "converts video/voice to mp3",
    type: "downloader",
  },
  async (message, match, m) => {
    let buff = await m.quoted.download();
    buff = await toAudio(buff, "mp3");
    return await message.sendMessage(message.jid,buff, { mimetype: "audio/mpeg" }, "audio");
  }
);

