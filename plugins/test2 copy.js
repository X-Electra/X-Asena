const { command } = require("../lib/");
command(
  {
    on: "video",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match) => {}
);
