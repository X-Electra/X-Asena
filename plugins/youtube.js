const { alpha, isPrivate, searchYT, PREFIX } = require("../lib");

alpha(
  {
    pattern: "song",
    fromMe: isPrivate,
    desc: "Downloads audio from YouTube.",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a query");
    try {
      const results = await searchYT(match);
      let buttons = [];
      let sections = [];
      results.forEach((result) => {
        sections.push({
          title: result.title,
          rows: [
            {
              title: result.title,
              id: `${PREFIX}ytsn ${result.url}`,
            },
          ],
        });
      });
      
      buttons.push({
        type: "list",
        params: {
          title: 'click to see results',
          sections: sections,
        },
      });

      let data = {
        jid: message.jid,
        button: buttons,
        header: {
          title: "Alpha-md",
          subtitle: "Whatsapp Bot",
          hasMediaAttachment: false,
        },
        footer: {
          text: "click to get result",
        },
        body: {
          text: `YouTube search results for ${match}`,
        },
      };
      await message.sendMessage(message.jid, data, {}, "interactive");
    } catch (error) {
      console.error("Error searching YouTube:", error);
      await message.reply("Error fetching YouTube results");
    }
  }
);


alpha(
  {
    pattern: "video",
    fromMe: isPrivate,
    desc: "Downloads videos from YouTube.",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a query");
    try {
      const results = await searchYT(match);
      let buttons = [];
      let sections = [];
      results.forEach((result) => {
        sections.push({
          title: result.title,
          rows: [
            {
              title: result.title,
              id: `${PREFIX}ytvd ${result.url}`,
            },
          ],
        });
      });
      
      buttons.push({
        type: "list",
        params: {
          title: 'click to see results',
          sections: sections,
        },
      });

      let data = {
        jid: message.jid,
        button: buttons,
        header: {
          title: "Alpha-md",
          subtitle: "Whatsapp Bot",
          hasMediaAttachment: false,
        },
        footer: {
          text: "click to get result",
        },
        body: {
          text: `YouTube search results for ${match}`,
        },
      };
      await message.sendMessage(message.jid, data, {}, "interactive");
    } catch (error) {
      console.error("Error searching YouTube:", error);
      await message.reply("Error fetching YouTube results");
    }
  }
);
