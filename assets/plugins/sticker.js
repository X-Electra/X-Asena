const config = require("../../config");
const { command, isPrivate, toAudio } = require("../../lib/");
command(
  {
    pattern: "sticker",
    fromMe: isPrivate,
    desc: "Converts Photo/video/text to sticker",
    type: "converter",
  },
  async (message, match, m) => {
    if (
      !(
        message.reply_message.video ||
        message.reply_message.image ||
        message.reply_message.text
      )
    )
      return await message.reply("_Reply to photo/video/text_");
    if (message.reply_message.text) {
      return await textToImage(message.reply_message.text,message);
    } else {
      let buff = await m.quoted.download();
      message.sendMessage(
        message.jid,
        buff,
        { packname: config.PACKNAME, author: config.AUTHOR },
        "sticker"
      );
    }
  }
);

const { createCanvas } = require("canvas");

async function textToImage(message,conn) {
  // Set up canvas
  const canvas = createCanvas(500, 200); 
  const ctx = canvas.getContext("2d");
  const maxInitialWidth = 500; 
  const lineHeight = 25; 
  const bubblePadding = 20; 
  const borderRadius = 20; 

  let initialWidth =
    Math.min(
      maxInitialWidth,
      ctx.measureText(message).width + 2 * bubblePadding
    ) + 30;

  
  const lines = breakTextIntoLines(
    ctx,
    message,
    initialWidth - 2 * bubblePadding
  );

  const bubbleWidth = initialWidth;
  const bubbleHeight = lines.length * lineHeight + 2 * bubblePadding;

  canvas.width = bubbleWidth;
  canvas.height = bubbleHeight;
  ctx.fillStyle = "#3CB371";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;

  // Draw rounded rectangle
  ctx.beginPath();
  ctx.moveTo(borderRadius, 0);
  ctx.lineTo(bubbleWidth - borderRadius, 0);
  ctx.arcTo(bubbleWidth, 0, bubbleWidth, borderRadius, borderRadius);
  ctx.lineTo(bubbleWidth, bubbleHeight - borderRadius);
  ctx.arcTo(
    bubbleWidth,
    bubbleHeight,
    bubbleWidth - borderRadius,
    bubbleHeight,
    borderRadius
  );
  ctx.lineTo(borderRadius, bubbleHeight);
  ctx.arcTo(0, bubbleHeight, 0, bubbleHeight - borderRadius, borderRadius);
  ctx.lineTo(0, borderRadius);
  ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0; // Disable shadow for text
  ctx.fillStyle = "#FFFFFF"; // White color for the text
  ctx.font = "18px sans-serif";

  lines.forEach((line, index) => {
    ctx.fillText(
      line,
      bubblePadding,
      bubblePadding + index * lineHeight + lineHeight
    );
  });

  // Save the image to a file
  const buffer = canvas.toBuffer("image/png");
  return conn.sendMessage(
    conn.jid,
    buffer,
    { packname: config.PACKNAME, author: config.AUTHOR },
    "sticker"
  );
}

function breakTextIntoLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + " " + words[i];
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }

  lines.push(currentLine);
  return lines;
}

command(
  {
    pattern: "take",
    fromMe: isPrivate,
    desc: "Converts Photo or video to sticker",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message.sticker)
      return await message.reply("_Reply to a sticker_");
    const packname = match.split(";")[0] || config.PACKNAME;
    const author = match.split(";")[1] || config.AUTHOR;
    let buff = await m.quoted.download();
    message.sendMessage(message.jid, buff, { packname, author }, "sticker");
  }
);

command(
  {
    pattern: "photo",
    fromMe: isPrivate,
    desc: "Changes sticker to Photo",
    type: "converter",
  },
  async (message, match, m) => {
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not a sticker_");
    let buff = await m.quoted.download();
    return await message.sendMessage(message.jid, buff, {}, "image");
  }
);

command(
  {
    pattern: "mp3",
    fromMe: isPrivate,
    desc: "converts video/voice to mp3",
    type: "downloader",
  },
  async (message, match, m) => {
    let buff = await m.quoted.download();
    console.log(typeof buff)
    buff = await toAudio(buff, "mp3");
    console.log(typeof buff)
    return await message.sendMessage(
      message.jid,
      buff,
      { mimetype: "audio/mpeg" },
      "audio"
    );
  }
);
