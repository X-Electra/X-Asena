const { command, parsedJid } = require("../../lib/");

command(
  {
    pattern: "fd",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "Util",
  },
  async (message, match, m) => {
    if(!m.quoted) return message.reply('Reply to something') 
    let jids = parsedJid(match);
    for (let i of jids) {
      await message.forward(i, message.reply_message.message);
    }   
  }
);