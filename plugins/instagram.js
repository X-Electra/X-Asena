const { command, getJson,isPrivate } = require("../lib/");

command(
  {
    pattern: "insta ?(.*)",
    fromMe: isPrivate,
    desc: "downloads video from instagram",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Enter link_");
    if (!match.includes("instagram.com"))
      return await message.reply("_Invalid URL_");
    let response = await getJson(
      `https://x-asena-api.up.railway.app/ig?q=${match}`
    );
    message.sendFromUrl(response.result[0].url);
  }
);

command(
  {
    pattern: "story ?(.*)",
    fromMe: isPrivate,
    desc: "downloads story from instagram",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Enter Username_");
    let response = await getJson(
      `https://hermit-network.herokuapp.com/api/story?username=${match}&key=adithyan`
    );
    if(!response.status) return message.reply('Not Found')
    for (let i of response.result) {
      message.sendFromUrl(i);
    }
  }
);
