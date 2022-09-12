const { command } = require("../lib/");
command(
  {
    on: "image",
    fromMe: true,
    desc: "description",
    type: "type",
  },
  async (message, match) => {}
);
