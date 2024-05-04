const { command, isPrivate, isUrl } = require("../../lib");
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
    if (!isUrl(match))
      return await message.reply("Give me a youtube link");
    let { dlink, title } = await yta(match);
    await message.reply(
      "Downloading audio...\n\nTitle: _" + title + "_ \n\nPlease wait..."
    );
    return await message.sendMessage(
      message.jid,
      dlink,
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
    if (!isUrl(match))
      return await message.reply("Give me a youtube link");
    let { dlink, title } = await ytv(match);
    await message.reply(
      "Downloading video...\n\nTitle: _" + title + "_ \n\nPlease wait..."
    );
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
