const { Function,isPrivate } = require("../lib/");
const config = require("../config");
const { getJson } = require("../lib");
Function(
  {
    pattern: "tgs ?(.*)",
    fromMe: isPrivate,
    desc: "Download Sticker From Telegram",
    type: "Tools",
  },
  async (message, match) => {
    if (!match)
      return message.reply(
        "_Enter a tg sticker url_\nEg: https://t.me/addstickers/Oldboyfinal\nKeep in mind that there is a chance of ban if used frequently"
      );
    let packid = match.split("/addstickers/")[1];
    let { result } = await getJson(
      `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
        packid
      )}`
    );
    if (result.is_animated)
      return message.reply("_Animated stickers are not supported_");
    message.reply(
      `*Total stickers :* ${result.stickers.length}\n*Estimated complete in:* ${
        result.stickers.length * 1.5
      } seconds`.trim()
    );
    for (let sticker of result.stickers) {
      let file_path = await getJson(
        `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${sticker.file_id}`
      );
      // message.reply(file_path.result.file_path)
      await message.sendMessage(`https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file_path.result.file_path}`,{ packname: config.PACKNAME, author: config.AUTHOR },'sticker')
     // sleep(1500);
    }
  }
);
