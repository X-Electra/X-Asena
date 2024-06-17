const { alpha, getUrl, igdl, isIgUrl, isPrivate, tiktokdl, twitter, fbdown } = require("../lib");


alpha(
  {
    pattern: "igdl",
    fromMe: isPrivate,
    desc: "To download instagram media",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a link");
    const url = getUrl(match.trim())[0];
    if (!url) return await message.reply("Invalid link");
    if (!isIgUrl(url))
      return await message.reply("Invalid Instagram link");
    if (!isIgUrl(match.trim()))
      return await message.reply("Invalid Instagram link");
    try {
      const data = await igdl(url)
      if (!data.status) return await message.reply('*Not Found*');
      return await message.sendFile(data.data);
    } catch (e) {
      await message.reply("Error: " + e);
    }
  }
);

alpha(
  {
    pattern: "ttv",
    fromMe: isPrivate,
    desc: "To download tiktok media",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a link");
    const url = getUrl(match.trim())[0];
    if (!url) return await message.reply("Invalid link");
    try {
      let { status, video  } = await tiktokdl(url);
      if (!status) return await message.reply('*Not Found*');
      return await message.sendFile(video);
    } catch (e) {
      await message.reply("Error: " + e);
    }
  }
);

alpha(
  {
    pattern: "twv",
    fromMe: isPrivate,
    desc: "To download twitter media",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a link");
    const url = getUrl(match.trim())[0];
    if (!url) return await message.reply("Invalid link");
    try {
      let { status, video  } = await twitter(url);
      if (!status) return await message.reply('*Not Found*');
      return await message.sendFile(video);
    } catch (e) {
      await message.reply("Error: " + e);
    }
  }
);

alpha(
  {
    pattern: "fb",
    fromMe: isPrivate,
    desc: "To download facebook media",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a link");
    const url = getUrl(match.trim())[0];
    if (!url) return await message.reply("Invalid link");
    try {
      let { status, HD  } = await fbdown(url);
      if (!status) return await message.reply('*Not Found*');
      return await message.sendFile(HD);
    } catch (e) {
      await message.reply("Error: " + e);
    }
  }
);