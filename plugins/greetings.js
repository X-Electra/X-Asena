const { bot } = require("../lib/");
const { setWelcome ,getWelcome,delWelcome} = require("../lib/database/greetings");
bot(
  {
    pattern: "welcome ?(.*)",
    fromMe: true,
    desc: "Sets Welcome Message",
    type: "user",
  },
  async (message, match) => {
if(!match){
    
    return await message.sendMessage()
}
  }
);
