const axios = require("axios");
const { jidDecode } = require("@adiwajshing/baileys");
const { spawn } = require("child_process");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { command } = require("./event");
let { JSDOM } = require("jsdom");
const config = require("../config");
module.exports = {
  command,
  addCommand: command,
  Module: command,
  Function: command,
  isPrivate : config.WORK_TYPE.toLowerCase() === 'private',
store : require('./store'),
};
