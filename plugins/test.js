const { bot } = require("../lib");
bot(
  { pattern: "test ?(.*)", fromMe: true, desc: "testing......." },
  async (message, match) => {
   await message.sendMessage("test sekses");
   return await message.sendMessage(`match ${match}`);
  }
);
