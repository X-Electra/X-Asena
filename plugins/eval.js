const { command} = require("../lib/");
const { setWelcome ,getWelcome,delWelcome} = require("../lib/database/greetings");
const util = require("util");
command(
  { on: "text", fromMe: true, desc: "", type: "random" ,dontAddCommandList:true},
  async (message, match,ms,client) => {
    if (match.startsWith('>')){
    m = message;
    conn = message.client;
    const sock = message.client
    match = match.replace('>','')
    try {
      let evaled = await eval();
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      await message.sendMessage(evaled);
    } catch (err) {
      await message.sendMessage(util.format(err));
    }
  }}
);
