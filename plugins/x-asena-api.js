const { command, getJson } = require("../lib/");
command(
  {
    pattern: "country ?(.*)",
    fromMe: true,
    desc: "country info ",
    type: "search",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter country name_");

    const axios = require("axios");

    const response = await axios.get(
      "https://x-asena-api.up.railway.app/countries/",
      {
        params: {
          q: match.trim(),
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          TE: "trailers",
        },
      }
    );

    if (!response.result) return await message.reply("_Country not found_");
    str = "";
    for (let i of Object.keys(response.data.result)) {
      str += `*${i}* : ${response.data.result[i]}\n`;
    }
    return await message.reply(str);
  }
);

command(
  {
    pattern: "quest ?(.*)",
    fromMe: true,
    desc: "returns info on search term",
    type: "search",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter search term_");
    let response = await getJson(
      "https://x-asena-api.up.railway.app/quest/?q=" + encodeURIComponent(match)
    );
    return await message.reply(response.result);
  }
);
