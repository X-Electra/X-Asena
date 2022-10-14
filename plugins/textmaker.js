const { getBuffer, command, isPrivate } = require("../lib");
const NEED_WORD = "*You Must Enter a Word*";
const {
  ancient,
  arcane,
  avengers,
  balloon,
  balloon2,
  beach,
  bearlogo,
  berry,
  blackpink,
  blackpink1,
  blackpink2,
  blackpink3,
  blood,
  bokeh,
  bread,
  camerica,
  camerica2,
  chocolate,
  christmas,
  christmas2,
  christmas3,
  christmas4,
  christmas5,
  circuit,
  deepsea,
  deluxe,
  deluxe2,
  demon,
  denim,
  devil,
  diamonds,
  equalizer,
  fabric,
  fade,
  fire,
  flagamerica,
  giraffe,
  glass,
  glass2,
  glitch,
  glitch2,
  glossy,
  glue,
  golden,
  gradient,
  gradient2,
  graffiti,
  graffiti2,
  halloween,
  harrypotter,
  holograph,
  l1917,
  layered,
  leaves,
  love,
  love2,
  love3,
  luxury,
  luxury2,
  magma,
  marvel,
  marvel2,
  matrix,
  metal,
  metal2,
  metal3,
  metal4,
  metal5,
  metal6,
  metal7,
  metal8,
  metal9,
  minion,
  neon,
  neon2,
  neon3,
  neon4,
  neon5,
  neon6,
  newyear,
  orange,
  papercut,
  papercut2,
  phub,
  pottery,
  quote,
  r2,
  rainbow,
  retro,
  retro2,
  sand,
  sand2,
  sand3,
  sand4,
  scifi,
  scifi2,
  scifi3,
  skeleton,
  sketch,
  sky,
  sky2,
  sliced,
  space,
  space2,
  sparkle,
  spooky,
  spooky2,
  spooky3,
  steel,
  stone,
  stone2,
  stone3,
  stone4,
  strawberry,
  summer,
  summer2,
  thor,
  thunder,
  title,
  toxic,
  transformers,
  typography,
  underwater,
  vintage,
  watercolor,
  waterpipe,
  whitegold,
  wicker,
  window,
  winter,
} = require("@neeraj-x0/textpro");
/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sparkling",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var topText, bottomText;
    if (match.includes("/")) {
      var split = match.split("/");
      bottomText = split[1];
      topText = split[0];
    }

    var webimage = await getBuffer(
      `https://docs-jojo.herokuapp.com/api/sparkling?text1=${topText}&text2=${bottomText}`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "ninjalogo",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var webimage = await getBuffer(
      `https://docs-jojo.herokuapp.com/api/gaming?text=${match}`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neonlight",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var webimage = await getBuffer(
      `https://docs-jojo.herokuapp.com/api/neon_light?text=${match}`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sandwriting",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var webimage = await getBuffer(
      `https://api.xteam.xyz/textpro/sandwriting?text=${match}&APIKEY=d90a9e986e18778b`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "cloud",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var webimage = await getBuffer(
      `https://api.xteam.xyz/textpro/cloudtext?text=${match}&APIKEY=d90a9e986e18778b`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "pornhub",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var topText, bottomText;
    if (match.includes("/")) {
      var split = match.split("/");
      bottomText = split[1];
      topText = split[0];
    }

    var webimage = await getBuffer(
      `https://api.xteam.xyz/textpro/ph?text=${topText}&text2=${bottomText}&APIKEY=ab9942f95c09ca89`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "snow",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var webimage = await getBuffer(
      `https://api.xteam.xyz/textpro/snowtext?text=${match}&APIKEY=ab9942f95c09ca89`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "3dtext",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(NEED_WORD);

    var webimage = await getBuffer(
      `https://docs-jojo.herokuapp.com/api/text3d?text=${match}`
    );

    await message.sendMessage(webimage, {}, "image");
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "ancient",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await ancient(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "arcane",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await arcane(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "avengers",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = match.split(",");
    if (!t1 || !t2) return message.reply(" text1,text2");
    let data = await avengers(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "balloon",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await balloon(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "balloon2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await balloon2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "beach",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await beach(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "bearlogo",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await bearlogo(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "berry",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await berry(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "blackpink",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await blackpink(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "blackpink1",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await blackpink1(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "blackpink2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await blackpink2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "blackpink3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await blackpink3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "blood",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await blood(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "bokeh",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await bokeh(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "bread",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await bread(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "camerica",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = match.split(",");
    if (!t1 || !t2) return message.reply(" text1,text2");
    let data = await camerica(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "camerica2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await camerica2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "chocolate",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await chocolate(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "christmas",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await christmas(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "christmas2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await christmas2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "christmas3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await christmas3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "christmas4",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await christmas4(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "christmas5",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await christmas5(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "circuit",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await circuit(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "deepsea",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await deepsea(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "deluxe",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await deluxe(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "deluxe2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await deluxe2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "demon",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await demon(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "denim",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await denim(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "devil",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await devil(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "diamonds",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await diamonds(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "equalizer",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await equalizer(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "fabric",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await fabric(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "fade",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await fade(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "flagamerica",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await flagamerica(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "giraffe",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await giraffe(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "glass",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await glass(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "glass2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await glass2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "glitch",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await glitch(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "glitch2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await glitch2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "glossy",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await glossy(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "glue",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await glue(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "golden",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await golden(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "gradient",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await gradient(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "gradient2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await gradient2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "graffiti",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await graffiti(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "graffiti2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await graffiti2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "halloween",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await halloween(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "harrypotter",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await harrypotter(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "holograph",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await holograph(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "l1917",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await l1917(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "layered",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = match.split(",");
    if (!t1 || !t2) return message.reply(" text1,text2");
    let data = await layered(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "leaves",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await leaves(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "love",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await love(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "love2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await love2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "love3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await love3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "luxury",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await luxury(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "luxury2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await luxury2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "magma",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await magma(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "marvel",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = match.split(",");
    if (!t1 || !t2) return message.reply(" text1,text2");
    let data = await marvel(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "marvel2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = match.split(",");
    if (!t1 || !t2) return message.reply("text1,text2");
    let data = await marvel2(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "matrix",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await matrix(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal4",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal4(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal5",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal5(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal6",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal6(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal7",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal7(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal8",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal8(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "metal9",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await metal9(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "minion",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await minion(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neon",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await neon(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neon2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await neon2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neon3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await neon3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neon4",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await neon4(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neon5",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await neon5(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "neon6",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await neon6(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "newyear",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await newyear(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "orange",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await orange(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "papercut",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await papercut(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "papercut2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await papercut2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "phub",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await phub(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "pottery",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await pottery(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "quote",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await quote(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "r2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await r2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "rainbow",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await rainbow(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "retro",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await retro(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "retro2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2, t3] = match.split(",");
    if (!t1 || !t2 || !t3) return message.reply(" text1,text2,text2");
    let data = await retro2(t1, t2, t3);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sand",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sand(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sand2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sand2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sand3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sand3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sand4",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sand4(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "scifi",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await scifi(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "scifi2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await scifi2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "scifi3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await scifi3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "skeleton",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await skeleton(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sketch",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sketch(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sky",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sky(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sky2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sky2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sliced",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sliced(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "space",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await space(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "space2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = message.split(",");
    if (!t1 && !t2) return message.reply("text1,text2");
    let data = await space2(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "sparkle",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await sparkle(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "spooky",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await spooky(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "spooky2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = message.split(",");
    if (!t1 && !t2) return message.reply("text1,text2");
    let data = await spooky2(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "spooky3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = message.split(",");
    if (!t1 && !t2) return message.reply("text1,text2");
    let data = await spooky3(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "steel",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await steel(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "stone",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await stone(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "stone2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await stone2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "stone3",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await stone3(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "stone4",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = message.split(",");
    if (!t1 && !t2) return message.reply("text1,text2");
    let data = await stone4(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "strawberry",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await strawberry(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "summer",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await summer(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "summer2",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await summer2(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "thor",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await thor(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "thunder",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await thunder(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "title",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await title(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "toxic",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await toxic(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "transformers",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await transformers(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "typography",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await typography(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "underwater",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await underwater(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "vintage",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let [t1, t2] = message.split(",");
    if (!t1 && !t2) return message.reply("text1,text2");
    let data = await vintage(t1, t2);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "watercolor",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await watercolor(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "waterpipe",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await waterpipe(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "whitegold",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await whitegold(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "wicker",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await wicker(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "window",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await window(match);
    await message.sendFromUrl(data.url);
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "winter",
    fromMe: isPrivate,
    dontAddCommandList: false,
    type: "Textpro",
  },
  async (message, match) => {
    if (!match) return await message.reply("Enter Text");
    let data = await winter(match);
    await message.sendFromUrl(data.url);
  }
);
