const { command } = require("../lib/");
command(
  {
    pattern: "test ",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    const buttons = [
      {buttonId: ',menu', buttonText: {displayText: 'menu'}},
      {buttonId: ',ping', buttonText: {displayText: 'ping'}}
    ]
    
    const buttonMessage = {
        text: "Hi it's button message",
        footer: 'Hello World',
        buttons: buttons,
        headerType: 1
    }
    
    await message.client.sendMessage(message.jid, buttonMessage)
  }
);
