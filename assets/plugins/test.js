const { command, isPrivate } = require("../../lib/");
const { isAdmin, parsedJid } = require("../../lib");

command(
  {
    pattern: "kickall",
    fromMe: true,
    desc: "Adds a person to group",
    type: "group",
  },
  async (message, match) => {
    let { participants } = await message.client.groupMetadata(message.jid);
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");

    for (let key of participants) {
      let jid = parsedJid(key.id);
      if (!(parsedJid(message.client.user.id)[0] in jid)) {
        await message.kick(jid);
        await message.reply(`@${jid[0].split("@")[0]} kicked`, {
          mentions: jid,
        });
      }
    }
  }
);
