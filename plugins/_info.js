const plugins = require("../lib/plugins");
const { alpha, isPrivate, runtime } = require("../lib");
const { OWNER_NAME, BOT_NAME, TZ } = require("../config");
const os = require("os");
const packageJson = require("../package.json");

alpha(
  {
    pattern: "menu",
    fromMe: isPrivate,
    desc: "Show All Commands",
    type: "info",
  },
  async (message, match) => {
    try {
      if (match) {
        for (let i of plugins.commands) {
          if (
            i.pattern instanceof RegExp &&
            i.pattern.test(message.prefix + match)
          ) {
            const cmdName = i.pattern.toString().split(/\W+/)[1];
            await message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
Description: ${i.desc}\`\`\``);
            return;
          }
        }
      } else {
        let { prefix } = message;
        let [date, time] = new Date()
          .toLocaleString("en-IN", { timeZone: TZ })
          .split(",");
        let menu = `╭━〔 ${BOT_NAME} 〕━◉
┃╭━━━━━━━━━━━━━━◉
┃┃ *Plugins :-* ${plugins.commands.length.toString()}
┃┃ *User :-* ${message.pushName}
┃┃ *Owner :-* ${OWNER_NAME}
┃┃ *Version:-* ${packageJson.version} 
┃┃ *Prefix:-* ${prefix}
┃┃ *Mode :-* ${isPrivate ? "private" : "public"}
┃┃ *Date :-* ${date.trim()}
┃┃ *Time :-* ${time.trim()}
┃┃ *Ram :-* ${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)}MB
┃╰━━━━━━━━━━━━━◉`;

        let cmnd = [];
        let cmd;
        let category = [];
        plugins.commands.forEach((command) => {
          if (command.pattern instanceof RegExp) {
            cmd = command.pattern.toString().split(/\W+/)[1];
          }

          if (!command.dontAddCommandList && cmd !== undefined) {
            let type = command.type ? command.type.toLowerCase() : "misc";
            cmnd.push({ cmd, type });
            if (!category.includes(type)) category.push(type);
          }
        });

        category.sort().forEach((cmmd) => {
          menu += `
┠┌─⭓『 *${cmmd.toUpperCase()}* 』`;
          let comad = cmnd.filter(({ type }) => type == cmmd);
          comad.forEach(({ cmd }) => {
            menu += `\n┃│◦ _${cmd.trim()}_ `;
          });
          menu += `\n┃└──────────⭓`;
        });

        menu += `
╰━━━━━━━━━━━━━◉_`;

        await message.reply(menu);
      }
    } catch (error) {
      console.error("Error in menu command:", error);
    }
  },
);

alpha(
  {
    pattern: "list",
    fromMe: isPrivate,
    desc: "Show All Commands",
    type: "info",
  },
  async (message, match) => {
    try {
      let menu = "\t\t```Command List```\n";

      let cmnd = [];
      let cmd, desc;
      plugins.commands.forEach((command) => {
        if (command.pattern) {
          cmd = command.pattern.toString().split(/\W+/)[1];
        }
        desc = command.desc || false;

        if (!command.dontAddCommandList && cmd !== undefined) {
          cmnd.push({ cmd, desc });
        }
      });
      cmnd.sort();
      cmnd.forEach(({ cmd, desc }, num) => {
        menu += `\`\`\`${num + 1} ${cmd.trim()}\`\`\`\n`;
        if (desc) menu += `Use: \`\`\`${desc}\`\`\`\n\n`;
      });
      await message.reply(menu);
    } catch (error) {
      console.error("Error in list command:", error);
    }
  },
);

alpha(
  {
    pattern: "ping",
    fromMe: isPrivate,
    desc: "To check ping",
    type: "info",
  },
  async (message, match) => {
    try {
      const start = Date.now();
      const msg = await message.sendMessage(message.jid, "*Pong!*");
      const end = Date.now();
      await msg.edit2("```" + (end - start) + "``` *ms*");
    } catch (error) {
      console.error("Error in ping command:", error);
    }
  },
);
