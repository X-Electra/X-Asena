const {
  command,
  isPrivate,
  qrcode,
  Bitly,
  isUrl,
  readQR,
  AItts,
} = require("../../lib/");

const { downloadMediaMessage } = require("@whiskeysockets/baileys");
command(
  {
    pattern: "vv",
    fromMe: isPrivate,
    desc: "Forwards The View once messsage",
    type: "tool",
  },
  async (message, match, m) => {
    let buff = await m.quoted.download();
    return await message.sendFile(buff);
  }
);

command(
  {
    pattern: "qr",
    fromMe: isPrivate,
    desc: "Read/Write Qr.",
    type: "Tool",
  },
  async (message, match, m) => {
    match = match || (message.reply_message && message.reply_message.text);

    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image) {
      return await message.sendMessage(
        "*Example : qr test*\n*Reply to a qr image.*"
      );
    }

    const buffer = await downloadMediaMessage(
      message.reply_message,
      "buffer",
      {},
      {
        reuploadRequest: message.client.updateMediaMessage,
      }
    );
    readQR(buffer)
      .then(async (data) => {
        return await message.sendMessage(data);
      })
      .catch(async (error) => {
        console.error("Error:", error.message);
        return await message.sendMessage(error.message);
      });
  }
);
command(
  {
    pattern: "bitly ?(.*)",
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
  }
);

command(
  {
    pattern: "tts",
    fromMe: true,
    desc: "Convert text to speech",
  },
  async (message, match) => {
    try {
      const text = match || message.reply_message.text;
      if (!text) {
        await message.reply("Please provide the text for TTS.");
        return;
      }
      await AItts(message, text);
    } catch (error) {
      console.error("Error processing TTS command:", error);
    }
  }
);

