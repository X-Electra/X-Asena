const { command } = require("../lib/");
command(
  {
    pattern: "test ?(.*)",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    message.downloadMediaMessage()
  }
);
