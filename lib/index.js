
const axios = require("axios");
const { spawn } = require("child_process");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { bot } = require("./event");
let { JSDOM } = require("jsdom");
module.exports = {
  bot,
  addCommand: bot,
  Module: bot,
  Function: bot,
  parseJid(text = ''){
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
},
  getJson: async function getJson(url, options) {
    try {
      options ? options : {};
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
        ...options,
      });
      return res.data;
    } catch (err) {
      return err;
    }
  },
  isUrl: (isUrl = (url) => {
    return url.match(
      new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
        "gi"
      )
    );
  }),
  getBuffer: async function getBuffer(url, options) {
    try {
      options ? options : {};
      const res = await require("axios")({
        method: "get",
        url,
        headers: {
          DNT: 1,
          "Upgrade-Insecure-Request": 1,
        },
        ...options,
        responseType: "arraybuffer",
      });
      return res.data;
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  },
webp2mp4:  async (source)=> {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    form.append("new-image-url", isUrl ? source : "");
    form.append("new-image", isUrl ? "" : source, "image.webp");
    let res = await fetch("https://ezgif.com/webp-to-mp4", {
      method: "POST",
      body: form,
    });
    let html = await res.text();
    let { document } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};
    for (let input of document.querySelectorAll("form input[name]")) {
      obj[input.name] = input.value;
      form2.append(input.name, input.value);
    }
    let res2 = await fetch("https://ezgif.com/webp-to-mp4/" + obj.file, {
      method: "POST",
      body: form2,
    });
    let html2 = await res2.text();
    let { document: document2 } = new JSDOM(html2).window;
    return new URL(
      document2.querySelector("div#output > p.outfile > video > source").src,
      res2.url
    ).toString();
  },
  
};
