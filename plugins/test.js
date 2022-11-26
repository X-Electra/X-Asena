const {} = require("jimp");
const { command, getBuffer } = require("../lib");

command(
  {
    pattern: "test ?(.*)",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message) => {
    
    let buff = await getBuffer("https://w0.peakpx.com/wallpaper/609/893/HD-wallpaper-millie-bobby-brown-eye-jaw.jpg")
    let msg = await message.client.updateProfilePicture(message.user,buff);
    message.reply(JSON.stringify(msg))
  }
);
