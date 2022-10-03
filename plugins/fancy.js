const { command, styletext, listall, tiny } = require("../lib/");
command(
  {
    pattern: "fancy ?(.*)",
    fromMe: true,
    desc: "converts text to fancy text",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message && !message.reply_message.text) {
      let text = tiny("Fancy text generator\n\nreply to a text with number\n\n");
      listall("Fancy").forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
      return await message.reply(text);
    } else {
      message.reply(styletext(message.reply_message.text, parseInt(match)));
    }
  }
);
