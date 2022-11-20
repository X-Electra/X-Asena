const { command } = require("../lib");
const Config = require("../config");
const { SUDO } = require("../config");
const Heroku = require("heroku-client");
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });
const baseURI = "/apps/" + Config.HEROKU_APP_NAME;


command(
  { pattern: "setsudo ?(.*)", 
    fromMe: true, 
    desc: "set sudo", 
    type: "user" },
  async (message,match, m) => {
    var newSudo = (message.mention[0]).split("@")[0] || (message.reply_message.jid).split("@")[0]
    if (!newSudo)
      return await m.sendMessage("*reply to a number*", { quoted: m });
    var setSudo = (SUDO + "," + newSudo).replace(/,,/g, ",");
    setSudo = setSudo.startsWith(",") ? setSudo.replace(",", "") : setSudo;
    await message.sendMessage("_new sudo numbers are:_" + setSudo, {
      quoted: m,
    });
    await message.sendMessage("_It takes 30 seconds to make effect_", { quoted: m });
    await heroku
      .patch(baseURI + "/config-vars", { body: { SUDO: setSudo } })
      .then(async (app) => {});
  }
);

command(
  { pattern: "getsudo ?(.*)", 
    fromMe: true, 
    desc: "shows sudo", 
    type: "Human tool" 
  },
  async (message, match) => {
    const vars = await heroku
      .get(baseURI + "/config-vars")
      .catch(async (error) => {
        return await message.send("HEROKU : " + error.body.message);
      });
    await message.sendMessage("```" + `SUDO Numbers are : ${vars.SUDO}` + "```");
  }
);
