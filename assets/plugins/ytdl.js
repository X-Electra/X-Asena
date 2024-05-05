const {
  command,
  isPrivate,
  isUrl,
  AddMp3Meta,
  getBuffer,
  toAudio,
} = require("../../lib");
const { yta, ytv } = require("../../lib/ytdl");

command(
  {
    pattern: "yta",
    fromMe: isPrivate,
    desc: "Download audio from youtube",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a youtube link");
    if (!isUrl(match)) return await message.reply("Give me a youtube link");
    let { dlink, title } = await yta(match);
    await message.reply(`_Downloading ${title}_`);
    let buff = await getBuffer(dlink);
    buff = await toAudio(buff, "mp3");
    return await message.sendMessage(
      message.jid,
      buff,
      {
        mimetype: "audio/mp4",
        filename: title + ".mp3",
      },
      "audio"
    );
  }
);

command(
  {
    pattern: "ytv",
    fromMe: isPrivate,
    desc: "Download audio from youtube",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a youtube link");
    if (!isUrl(match)) return await message.reply("Give me a youtube link");
    let { dlink, title } = await ytv(match,'360p');
    await message.reply(`_Downloading ${title}_`);
    return await message.sendMessage(
      message.jid,
      dlink,
      {
        mimetype: "video/mp4",
        filename: title + ".mp4",
      },
      "video"
    );
  }
);
