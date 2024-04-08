const { command, isPrivate } = require("../../lib/");
const axios = require("axios");

command(
  {
    pattern: "test",
    fromMe: true,
    desc: "To check ping",
    type: "user",
  },
  async (message, match) => {
    const axios = require("axios");
    axios
      .get("http://localhost:3000/api/ig?url=" + match.trim())
      .then((response) => {
        console.log(response.data);
      });
  }
);
