const { command } = require("../lib/");
const {
  setWelcome,
  getWelcome,
  enableWelcome,
  getWelcomeStatus,
  disableWelcome,
} = require("../lib/database/greetings");
command(
  {
    pattern: "welcome ",
    fromMe: true,
    desc: "Sets Welcome Message",
    type: "user",
  },
  async (message, match) => {
    if (!match) {
      let status = await getWelcomeStatus(message.jid)
      status = true ? "Disabled"  : 'Enabled';
      return await message.client.sendMessage(message.jid, {
        text: "_Welcome Manager_",
        footer: "welcome status :" + status,
        buttons: [
          {
            buttonId: ",welcome get",
            buttonText: { displayText: "GET WELCOME " },
          },
          { buttonId: ",welcome on", buttonText: { displayText: "ON" } },
          { buttonId: ",welcome off", buttonText: { displayText: "OFF" } },
        ],
      });
    }
    if (match === "get") {
      let msg = await getWelcome(message.jid);
      return await message.reply(msg.message);
    } else if (match === "on") {
      await enableWelcome(message.jid);
      return await message.reply("_Welcome Enabled for this group_");
    } else if (match === "off") {
      await disableWelcome(message.jid);
      return await message.reply("_Welcome Disabled for this group_");
    } else {
      await setWelcome(message.jid,match)
    }
  }
);
