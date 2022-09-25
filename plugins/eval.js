const {
  Function,
  isPrivate,
  getUrl,
  fromBuffer,
  Imgur,
  getBuffer,
  getJson,
  Fancy,
  AddMp3Meta,
  formatBytes,
  parseJid,
  isUrl,
  parsedJid,
  pinterest,
  wallpaper,
  wikimedia,
  quotesAnime,
  aiovideodl,
  umma,
  ringtone,
  styletext,
  FileSize,
  h2k,
  textpro,
  yt,
  ytIdRegex,
  yta,
  ytv,
  runtime,
  clockString,
  sleep,
  jsonformat,
  Serialize,
  processTime,
} = require("../lib/");
const util = require("util");
const config = require("../config");
Function(
  {
    pattern: "> ?(.*)",
    fromMe: true,
    desc: "Run js code (evel)",
    type: "misc",
  },
  async (message, match, client) => {
    return;
  }
);
Function(
  { on: "text", fromMe: true, desc: "Run js code (evel)", type: "misc" },
  async (message, match, m,client) => {
    if (match.startsWith(">")) {
      //const m = message;
      try {
        let evaled = await eval(`${match.replace(">", "")}`);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        await message.reply(evaled);
      } catch (err) {
        await message.reply(util.format(err));
      }
    }
  }
);
