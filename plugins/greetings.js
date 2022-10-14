const { command,tiny } = require("../lib/");
const {
  setMessage,
  getMessage,
  delMessage,
  getStatus,
  toggleStatus,
} = require("../lib/database/greetings");
command(
  {
    pattern: "welcome ?(.*)",
    fromMe: true,
    desc: "description",
    type: "group",
  },
  async (message, match) => {
    let {prefix} = message
    if (!message.isGroup) return;
    let status = await getStatus(message.jid, "welcome");
    let toggler = status ? "off" : "on";
    let stat = status ? "on" : "off";
    if (!match) {
      return await message.client.sendMessage(message.jid, {
        text: tiny("Welcome manager"),
        footer:
          (await (await message.client.groupMetadata(message.jid)).subject) +
          `\nstatus : ${stat}`,
        buttons: [
          {
            buttonId: prefix + "welcome get",
            buttonText: { displayText: "GET" },
          },
          {
            buttonId: prefix + "welcome " + toggler,
            buttonText: { displayText: toggler.toUpperCase() },
          },
        ],
      });
    }
    if (match === "get") {
      let msg = await getMessage(message.jid, "welcome");
      if (!msg) return await message.reply("_There is no welcome set_");
      return message.reply(msg.message);
    }
    if (match === "on") {
      let msg = await getMessage(message.jid, "welcome");
      if (!msg)
        return await message.reply("_There is no welcome message to enable_");
      if (status) return await message.reply("_Welcome already enabled_");
      await toggleStatus(message.jid);
      return await message.reply("_Welcome enabled_");
    }
    if (match === "off") {
      if (!status) return await message.reply("_Welcome already disabled_");
      await toggleStatus(message.jid, "welcome");
      return await message.reply("_Welcome disabled_");
    }
    if (match == "delete") {
      await delMessage(message.jid, "welcome");
      return await message.reply("_Welcome deleted succesfully_");
    }
    await setMessage(message.jid, "welcome", match);
    return await message.reply("_Welcome set succesfully_");
  }
);

command(
  {
    pattern: "goodbye ?(.*)",
    fromMe: true,
    desc: "description",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    let status = await getStatus(message.jid, "goodbye");
    let toggler = status ? "off" : "on";
    let stat = status ? "on" : "off";
    if (!match) {
      return await message.client.sendMessage(message.jid, {
        text: tiny("Goodbye manager"),
        footer:
          (await (await message.client.groupMetadata(message.jid)).subject) +
          `\nstatus : ${stat}`,
        buttons: [
          {
            buttonId: prefix + "goodbye get",
            buttonText: { displayText: "GET" },
          },
          {
            buttonId: prefix + "goodbye " + toggler,
            buttonText: { displayText: toggler.toUpperCase() },
          },
        ],
      });
    }
    if (match === "get") {
      let msg = await getMessage(message.jid, "goodbye");
      if (!msg) return await message.reply("_There is no goodbye set_");
      return message.reply(msg.message);
    }
    if (match === "on") {
      await toggleStatus(message.jid, "goodbye");
      return await message.reply("_Goodbye enabled_");
    }
    if (match === "off") {
      await toggleStatus(message.jid);
      return await message.reply("_Goodbye disabled_");
    }
    if (match == "delete") {
      await delMessage(message.jid, "goodbye");
      return await message.reply("_Goodbye deleted succesfully_");
    }
    await setMessage(message.jid, "goodbye", match);
    return await message.reply("_Goodbye set succesfully_");
  }
);
