const { command, parsedJid } = require("../lib/");

command(
  {
    pattern: "forward ?(.*)",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match, m) => {
    if(!m.quoted) return message.reply('Reply to something') 
    let jids = parsedJid(match);
    for (let i of jids) {
     let msg =  await message.client.relayMessage(i, m.quoted.message, {
        messageId: m.quoted.key.id,
      });
      console.log(msg)
    }   
  }
);
