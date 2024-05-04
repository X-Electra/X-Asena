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
const Greetings = require("./Greetings");;
module.exports = {
  toAudio,
  isPrivate: config.WORK_TYPE.toLowerCase() === "private",
  Greetings,
  isAdmin,
  serialize,
  downloadMedia,
  Function: command,
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
