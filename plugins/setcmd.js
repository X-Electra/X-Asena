/*const { proto, generateWAMessage } = require("@adiwajshing/baileys");
const { command ,db} = require("../lib");

command(
  {
    pattern: "setcmd",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match,m) => {
    if (!message.reply_message.hasOwnProperty("sticker"))
      return message.reply("Reply to a sticker");
    if (!message.reply_message.message.fileSha256)
      message.reply("SHA256 Hash Missing");
    if (!match) message.reply(`_Enter command for this sticker_`);
    let hash = message.reply_message.message.fileSha256.toString("base64");
    if (global.db.data.sticker[hash] && global.db.data.sticker[hash].locked)
      message.reply("You have no permission to change this sticker command");
   db.data.sticker[hash] = {
      command:match,
      mentionedJid: m.mentionedJid,
      creator: m.sender,
      at: +new Date(),
    };
    message.reply(`_Succesfully set *${match.trim()}* to sticker_`);
  }
);


command(
  {
    pattern: "delcmd ?(.*)",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message) => {
    let hash = message.reply_message.message.fileSha256.toString("base64");
    if (!hash) return message.reply('_File hash missing_')
    delete db.data.sticker[hash]
    message.reply(`_Succesfully deleted sticker from commands_`);
  
  }
);

command(
  {
    on: "sticker",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message,m,client,chatUpdate) => {
    if (message.message.fileSha256 && (message.message.fileSha256.toString('base64') in db.data.sticker)) {
      let hash = global.db.data.sticker[message.message.fileSha256.toString('base64').toString('base64')]
      let { command } = hash
      let messages = await generateWAMessage(message.jid, { text: command}, {
          userJid: client.user.id,
          quoted: m.quoted &&m.quoted.fakeObj
      } )
      messages.key.fromMe = message.fromMe
      messages.key.id = message.key.id
      messages.pushName = message.pushName
      messages.participant = message.participant
      let msg = {
          messages: [proto.WebMessageInfo.fromObject(messages)],
          type: 'notify'
      }
      await client.ev.emit('messages.upsert', msg)
      }
  }
);*/