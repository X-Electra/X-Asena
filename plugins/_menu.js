const events = require("../lib/event");
const { bot, getBuffer } = require("../lib");
const { readFileSync } = require("fs");
bot(
  {
    pattern: "menu ?(.*)",
    fromMe: true,
    desc: "Show All commands",
  },
  async (message, match) => {
    let menu = "";
    let cmnd = [];
    events.commands.map((command, num) => {
      let cmd;
      if (command.pattern) {
        cmd = command.pattern
          .toString()
          .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
      }

      if (!command.dontAddCommandList&&cmd !==undefined) {
        cmnd.push(cmd);
      }
    });
    cmnd.sort();
    cmnd.forEach((cmd, num) => {
      menu += `${(num += 1)} ${cmd} \n`;
    });
    message.sendMessage(menu, {
      quoted: {
        key: {
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
        },
        message: {
          orderMessage: {
            itemCount: 123,
            itemCoun: 404,
            surface: 404,
            message: `© X-asena`,
            orderTitle: "B",
            thumbnail: { url: "https://imgur.com/MCOhVfX" },
            sellerJid: "0@s.whatsapp.net",
          },
        },
      },
    });
  }
);
