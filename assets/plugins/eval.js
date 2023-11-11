const {
  start,
  isPrivate,
  Greetings,
  isAdmin,
  serialize,
  downloadMedia,
  command,
  commands,
  getBuffer,
  WriteSession,
  decodeJid,
  parseJid,
  parsedJid,
  getJson,
  isIgUrl,
  isUrl,
  getUrl,
  qrcode,
  secondsToDHMS,
  formatBytes,
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
} = require("../../lib/");
const util = require("util");
const config = require("../../config");
command(
  {
    pattern: "> ?(.*)",
    fromMe: true,
    desc: "Run js code (eval)",
    type: "misc",
  },
  async (message, match, client) => {
    return;
  }
);
command(
  { on: "text", fromMe: true, desc: "Run js code (eval)", type: "misc" },
  async (message, match, m) => {
    if (message.text.startsWith(">")) {
      try {
        let evaled = await eval(`${message.text.replace(">", "")}`);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        await message.reply(evaled);
      } catch (err) {
        await message.reply(util.format(err));
      }
    }
  }
);

command({ on: "text", fromMe: true }, async (message, match, m) => {
  if (message.text.startsWith("$")) {
    var conn = message.client;
    const util = require("util");
    const json = (x) => JSON.stringify(x, null, 2);
    try {
      let return_val = await eval(
        `(async () => { ${message.text.replace("$", "")} })()`
      );
      if (return_val && typeof return_val !== "string")
        return_val = util.inspect(return_val);
      if (return_val) await message.send(return_val || "No return value");
    } catch (e) {
      if (e) await message.send(util.format(e));
    }
  }
});
