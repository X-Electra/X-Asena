const { command } = require("../lib/");
const { setWelcome ,getWelcome,delWelcome} = require("../lib/database/greetings");
command(
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
