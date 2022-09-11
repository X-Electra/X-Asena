const { bot } = require("../lib/");
bot(
  {
    on: "image",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match) => {}
);
