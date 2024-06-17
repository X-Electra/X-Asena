const { alpha, qrcode, Bitly, isPrivate, isUrl, readQr, parsedJid} = require("../lib/");
const { downloadMediaMessage } = require("baileys");
const config = require("../config");

alpha(
  {
    pattern: "vv",
    fromMe: isPrivate,
    desc: "Forwards The View once messsage",
    type: "tool",
  },
  async (message, match, m) => {
    try {
      const buffer = await downloadMediaMessage(
        m.quoted,
        "buffer",
        {},
        {
          reuploadRequest: message.client.updateMediaMessage,
        },
      );
      return await message.sendFile(buffer);
    } catch (error) {
      console.error("[Error]:", error);
    }
  },
);

alpha(
  {
    pattern: "qr",
    fromMe: isPrivate,
    desc: "Read/Write Qr.",
    type: "tool",
  },
  async (message, match, m) => {
    match = match || message.reply_message.text;

    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(message.jid, buff, {}, "image");
    } else if (message.reply_message.image) {
      const buffer = await m.quoted.download();
      readQr(buffer)
        .then(async (data) => {
          return await message.sendMessage(message.jid, data);
        })
        .catch(async (error) => {
          console.error("Error:", error.message);
          return await message.sendMessage(message.jid, error.message);
        });
    } else {
      return await message.sendMessage(
        message.jid,
        "*Example : qr test*\n*Reply to a qr image.*",
      );
    }
  },
);

alpha(
  {
    pattern: "bitly",
    fromMe: isPrivate,
    desc: "Converts Url to bitly",
    type: "tool",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Reply to a url or enter a url_");
    if (!isUrl(match)) return await message.reply("_Not a url_");
    let short = await Bitly(match);
    return await message.reply(short.link);
  },
);

alpha(
  {
    pattern: "uptime",
    fromMe: true,
    desc: "Check uptime of bot",
    type: "user",
  },
  async (message, match) => {
    message.reply(`*Uptime:* ${secondsToDHMS(process.uptime())}`);
  },
);


alpha(
  {
    pattern: "fd",
    fromMe: isPrivate,
    desc: "Forwards the replied Message",
    type: "tool",
  },
  async (message, match, m) => {
    if (!m.quoted) return message.reply("Reply to something");
    let jids = parsedJid(match);
    for (let i of jids) {
      await message.forward(i, message.reply_message.message);
    }
  },
);
