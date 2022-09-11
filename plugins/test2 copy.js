const { bot } = require("../lib/");
bot(
  {
    on: "video",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match) => {}
);
