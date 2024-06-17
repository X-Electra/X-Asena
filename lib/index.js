const { alpha, commands } = require("./plugins");
let config = require("../config");
const axios = require("axios");
const { runtime, clockString } = require("./runtime");
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
  AddMp3Meta,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
  toAudio,
  readQr,
  getLyrics,
  isAdmin,
} = require("./functions");
const {
  tiktokdl,
  twitter,
  photoleap,
  fbdown,
  igdl,
  stream2buffer,
  searchYT,
  downloadMp3,
  downloadMp4,
  TTS,
  TRT,
  getYTInfo,
} = require("./scrapper");
const { serialize, downloadMedia } = require("./serialize");
const Greetings = require("./Greetings");

async function weather(m, match) {
  const text = match;
  if (!text) return await m.reply("*_need a location_*");
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=tr`;
  try {
    const response = await axios(url);
    const json = response.data;
    if (response.status === 200)
      return await m.reply( `*climate of* ${text} is\n\n🌄 *ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ:-* ${json.main.temp_max}\n💖 *ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ:-* ${json.weather[0].description}\n☀ *ʜᴜᴍɪᴅɪᴛʏ:-* ${json.main.humidity}\n💨 *ᴡɪɴᴅ:-* ${json.wind.speed}m/s\n🎇 *ᴄʟᴏᴜᴅ:-* ${json.clouds.all}\n`);
  } catch(e) {
    console.log(e)
    return await m.reply("_*no data found for this location*_");
  }
}

module.exports = {
  toAudio,
  runtime,
  clockString,
  isPrivate: config.WORK_TYPE.toLowerCase() === "private",
  PREFIX:
  !config.HANDLERS || config.HANDLERS == "false" || config.HANDLERS == "null"
    ? ""
    : config.HANDLERS.includes("[") && config.HANDLERS.includes("]")
      ? config.HANDLERS[2]
      : config.HANDLERS.trim(),
  weather,
  Greetings,
  isAdmin,
  serialize,
  getLyrics,
  readQr,
  downloadMedia,
  Function: alpha,
  alpha,
  commands,
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
  tiktokdl,
  twitter,
  photoleap,
  fbdown,
  igdl,
  stream2buffer,
  searchYT,
  downloadMp3,
  downloadMp4,
  TTS,
  TRT,
  getYTInfo,
  sleep,
  AddMp3Meta,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
};
