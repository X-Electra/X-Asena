const { command, sleep, isPrivate, isUrl, Bitly } = require("../lib/");
command(
  {
    pattern: "getqr ?(.*)",
    fromMe: isPrivate,
    desc: "Get connection QR",
    type: "misc",
  },
  async (message, match) => {
    for (let index = 0; index < 5; index++) {
      await sleep(30 * 1000);
      await message.sendFromUrl("https://x-asena-qr.herokuapp.com/", {
        caption: "Scan within 20 seconds",
      });
    }
    return await message.reply("Your session is OVER");
  }
);

command(
  {
    pattern: "bitly ?(.*)",
    fromMe: isPrivate,
    desc: "Converts Url to bitly",
    type: "tool",
  },
  async (message, match) => {
    match = match||message.reply_message.text
    if(!match) return await message.reply('_Reply to a url or enter a url_')
    if(!isUrl(match)) return await message.reply('_Not a url_')
    let short = await Bitly(match)
    return await message.reply(short.link)
  }
);
