const {
  command,
  isPrivate,
  getUrl,
  getBuffer,
  getJson,
  parsed,
  commandJid,
} = require("../lib/");
const util = require("util");
const config = require("../config");
command(
  {
    pattern: "eval ?(.*)",
    fromMe: true,
    desc: "Run js code (evel)",
    type: "misc",
  },
  async (message, match, client) => {
    return;
  }
);
command(
  { on: "text", fromMe: true, desc: "Run js code (evel)", type: "misc" },
  async (message, match, client) => {
    if (message.text.startsWith(">")) {
      const m = message;
      try {
        let evaled = await eval(
          `(async () => { ${message.text.replace(">", "")} })()`
        );
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        await message.reply(evaled);
      } catch (err) {
        await message.reply(util.format(err));
      }
    }
  }
);
