const { command } = require("../lib/");

command(
  {
    pattern: "ping ?(.*)",
    fromMe: true,
    desc: "To check ping",
    type: "misc",
  },
  async (message, match) => {
    const start = new Date().getTime();
    await message.sendMessage("```Ping!```");
    const end = new Date().getTime();
    return await message.sendMessage(
      "*Pong!*\n ```" + (end - start) + "``` *ms*"
    );
  }
);
