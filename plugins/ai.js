const { alpha, isPrivate, photoleap } = require("../lib/");

alpha(
  {
    pattern: "dalle",
    fromMe: isPrivate,
    desc: "Generate image from text",
    type: "image",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.sendMessage(message.jid, "Provide a text");
    let buff = `https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(match)}`;
    return await message.sendMessage(
      message.jid,
      buff,
      {
        mimetype: "image/jpeg",
        caption: "```Alpha Dall-E Interface```",
      },
      "image",
    );
  },
);

alpha(
  {
    pattern: "pleap",
    fromMe: isPrivate,
    desc: "Generate image from text",
    type: "image",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.sendMessage(message.jid, "Provide a text");
    const res = await photoleap(match);
    if (res.status === true) {
      return await message.sendMessage(
        message.jid,
        res.url,
        {
          mimetype: "image/jpeg",
          caption: "```Alpha Photoleap Interface```",
        },
        "image",
      );
    } else {
      return await message.reply("```An error occured```");
    }
  },
);
