const { alpha, isPrivate, searchYT, PREFIX } = require("../lib");

alpha(
    {
      pattern: "yts",
      fromMe: isPrivate,
      desc: "Search YouTube and send results as buttons",
    },
    async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply("Give me a query");
      try {
        const results = await searchYT(match);
        let buttons = [];
        results.forEach((result) => {
          buttons.push({
            type: "list",
            params: {
              title: 'cliclk to see results',
              sections: [
                {
                  title: result.title,
                  rows: [
                    {
                      header: "title",
                      title: result.title,
                      description: "Watch Video",
                      id: `${PREFIX}song ${result.url}`,
                    },
                  ],
                },
              ],
            },
          });
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
            text: `youtube search results for ${match}`,
          },
        };
        await message.sendMessage(message.jid, data, {}, "interactive");
      } catch (error) {
        console.error("Error searching YouTube:", error);
        await message.reply("Error fetching YouTube results");
      }
    }
  );
  