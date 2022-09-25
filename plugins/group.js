const config = require("../config");
const { command,isPrivate} = require("../lib/");
const { isAdmin, parsedJid, isUrl } = require("../lib");

command(
  {
    pattern: "add ",
    fromMe: isPrivate,
    desc: "Adds a person to group",
    type: "type",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} added`, {
      mentions: jid,
    });
  }
);

command(
  {
    pattern: "kick ",
    fromMe: isPrivate,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} kicked`, {
      mentions: jid,
    });
  }
);

command(
  {
    pattern: "promote ",
    fromMe: isPrivate,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} promoted as admin`, {
      mentions: jid,
    });
  }
);
command(
  {
    pattern: "demote ",
    fromMe: isPrivate,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    match = match || message.reply_message.jid;
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} demoted from admin`, {
      mentions: jid,
    });
  }
);

/**
 * antilink
*/
command(
  {
    on: "text",
    fromMe : false
  },
  async (message, match) => {
    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("_Link detected_");
        let botadmin = await isAdmin(message.jid, message.user, message.client)
        let senderadmin = await isAdmin(message.jid, message.participant, message.client)
        if (botadmin) {
          if (!senderadmin){
          await message.reply(
            `_Commencing Specified Action :${config.ANTILINK_ACTION}_`
          );
          return await message[config.ANTILINK_ACTION]([message.participant]);
        }} else {
          return await message.reply("_I'm not admin_");
        }
      }
  }
);
