const { command,isPrivate} = require("../lib/");
const jimp = require("jimp");
const QRReader = require("qrcode-reader");
const { qrcode } = require("../lib/functions");

command(
  { pattern: "qr ?(.*)", fromMe: isPrivate, desc: "Read/Write Qr.", type: "misc" },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage("*Example : qr test*\n*Reply to a qr image.*");

    const { bitmap } = await jimp.read(
      await message.reply_message.downloadMediaMessage()
    );
    const qr = new QRReader();
    qr.callback = (err, value) =>
      message.sendMessage(err ?? value.result, { quoted: message.data });
    qr.decode(bitmap);
  }
);
