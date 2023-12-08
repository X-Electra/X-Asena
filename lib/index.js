const { command, commands } = require("./plugins");
let config = require("../config");
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");
const openai_api = "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";
const openai = new OpenAI({ apiKey: openai_api });

const pm2 = require("pm2");

const {
  getBuffer,
  decodeJid,
  parseJid,
  parsedJid,
  getJson,
  isIgUrl,
  isUrl,
  getUrl,
  qrcode,
  secondsToDHMS,
  formatBytes,
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
  WriteSession,
  toAudio,
  isAdmin,
} = require("./functions");
const { serialize, downloadMedia } = require("./serialize");
const Greetings = require("./Greetings");
let cluster = require("cluster");
let path = require("path");
let fs = require("fs");
const Readline = require("readline");

var isRunning = false;
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;
  let args = [path.join(__dirname, file), ...process.argv.slice(2)];

  cluster.setupMaster({
    exec: path.join(__dirname, file),
    args: args.slice(1),
  });
  let p = cluster.fork();
  p.on("message", (data) => {
    console.log("[RECEIVED]", data);
    switch (data) {
      case "reset":
        p.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case "uptime":
        p.send(process.uptime());
        break;
    }
  });
  p.on("exit", (code) => {
    isRunning = false;
    console.error("Exited with code:", code);
    if (code === 0) return;
    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0]);
      start(file);
    });
  });
}

function pm2Uptime() {
  const processName = "x-asena";
  return new Promise((resolve, reject) => {
    pm2.connect((error) => {
      if (error) {
        reject("Error connecting to PM2:", error);
      }

      pm2.describe(processName, (describeError, processList) => {
        if (describeError) {
          reject("Error describing process:", describeError);
          pm2.disconnect();
        }

        if (processList.length === 0) {
          reject("Process not found:", processName);
          pm2.disconnect();
        }

        const uptime =
          processList[0].pm2_env.status === "online"
            ? processList[0].pm2_env.created_at
            : null;

        if (uptime) {
          resolve(uptime);
        } else {
          reject(`Process '${processName}' is not online`);
        }

        pm2.disconnect();
      });
    });
  });
}

async function AItts(message, text) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    await message.sendMessage(message.jid, buffer, {
      quoted: message,
      mimetype: "audio/mp3",
    });
  } catch (error) {
    console.error("Error generating TTS:", error);
  }
}

async function XKCDComic() {
  try {
    const response = await axios.get("https://c.xkcd.com/random/comic/");
    const html = response.data;
    const $ = cheerio.load(html);

    const imageUrl = $('a[href^="https://imgs.xkcd.com/comics/"]').attr("href");
    const result = {
      imageUrl: imageUrl,
    };

    return result;
  } catch (error) {
    console.error("Error fetching XKCD comic:", error.message);
    throw error;
  }
}

const { createCanvas, loadImage } = require("canvas");
const jsQR = require("jsqr");

async function readQR(imageBuffer) {
  try {
    const canvas = createCanvas();
    const context = canvas.getContext("2d");
    const image = await loadImage(imageBuffer);
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      return code.data;
    } else {
      throw new Error("No QR code found in the image");
    }
  } catch (error) {
    console.error("Error reading QR code:", error.message);
    throw error;
  }
}

module.exports = {
  AItts,
  toAudio,
  pm2Uptime,
  XKCDComic,
  readQR,
  start,
  isPrivate: config.WORK_TYPE.toLowerCase() === "private",
  Greetings,
  isAdmin,
  serialize,
  downloadMedia,
  command,
  commands,
  getBuffer,
  WriteSession,
  decodeJid,
  parseJid,
  parsedJid,
  getJson,
  isIgUrl,
  isUrl,
  getUrl,
  qrcode,
  secondsToDHMS,
  formatBytes,
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
};
