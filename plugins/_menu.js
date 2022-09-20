const events = require("../lib/event");
const { command, getBuffer } = require("../lib");
const { readFileSync } = require("fs");
command(
  {
    pattern: "menu ?(.*)",
    fromMe: true,
    desc: "Show All commands",
  },
  async (message, match) => {
    let menu = `╭╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼\n╽`
    let cmnd = [];
    let cmd,desc;
    events.commands.map((command, num) => {
   
      if (command.pattern) {
        cmd = command.pattern
          .toString()
          .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
      }
      if (command.desc) {
        desc = command.desc}else {
          desc = ''
        }
      if (!command.dontAddCommandList&& cmd !==undefined) {
        cmnd.push({cmd,desc});
      }
    });
    cmnd.sort();
    cmnd.forEach(({cmd,desc}, num) => {
      menu += `\n┠${(num += 1)} \`\`\`${cmd}\`\`\` \n╿`;
      menu += `\n┠  ${desc}\n╿`;
    });
    menu += `\n╰╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼`
    message.sendMessage(readFileSync("./media/thumb.jpeg"), {caption:menu},'image');
  }
);
