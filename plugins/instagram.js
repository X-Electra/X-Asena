const { command, getJson, isPrivate } = require("../lib/");
const IgDl = require("../lib/scrapers");

command(
  {
    pattern: "insta",
    fromMe: isPrivate,
    desc: "downloads video from instagram",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Enter link_");
    if (!match.includes("instagram.com"))
      return await message.reply("_Invalid URL_");
    let response = await IgDl(match);
    if (response.status != 200) return message.reply("Not Found");
    for (let i of response.result) {
      message.sendFromUrl(i);
    }
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
    if (!response.status) return message.reply("Not Found");
    for (let i of response.result) {
      message.sendFromUrl(i);
    }
  }
);
