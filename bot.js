/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

const {
  default: makeWASocket,
  Browsers,
  makeInMemoryStore,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image, Sticker } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const config = require("./config");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
const { MakeSession } = require("./lib/session");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

require("events").EventEmitter.defaultMaxListeners = 0;
if (!fs.existsSync(__dirname + "/lib/auth_info_baileys/creds.json")) {
  var code = config.SESSION_ID.replace(/_XASENA_/g, "");
  code = Buffer.from(code, "base64").toString("utf-8");
    const PastebinAPI = require("pastebin-js"),
    pastebin = new PastebinAPI("h4cO2gJEMwmgmBoteYufW6_weLvBYCqT");
    pastebin
        .getPaste(code)
        .then(async function(data) {
            await fs.writeFileSync(__dirname + "/lib/auth_info_baileys/creds.json", data, "utf8")
            console.log('🚀Generating session from SESSION_ID\n⌛️Please wait 3 Seconds.')
            console.log("Vesrion : " + require(__dirname+"/package.json").version)
                //console.log(data);
        })
        .fail(function(err) {
            console.log('X-Asena couldn\'t find session with given SESSION_ID')
                //  console.log(err);
            process.exit(0)
        })
}

fs.readdirSync(__dirname+"/lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
    require(__dirname+"/lib/database/" + plugin);
  }
});
async function Xasena() {
  console.log("Syncing Database");
  await config.DATABASE.sync();
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/lib/auth_info_baileys/');
  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    generateHighQualityLinkPreview: true,
    browser: Browsers.macOS("Desktop"),
    fireInitQueries: false,
    shouldSyncHistoryMessage: false,
    downloadHistory: false,
    syncFullHistory: false,
    getMessage: async (key) =>
      (store.loadMessage(key.id) || {}).message || {
        conversation: null,
      }
  });
  store.bind(conn.ev);
  setInterval(() => {
    store.writeToFile("./database/store.json");
  }, 30 * 60 * 1000);

  conn.ev.on("creds.update", saveCreds);

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    console.log(s)
    console.log(state)
    if (connection === "connecting") {
      console.log("X-Asena");
      console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
    }
    if (connection === "open") {
      console.log("✅ Login Successful!");
      console.log("⬇️ Installing External Plugins...");

      let plugins = await PluginDB.findAll();
      plugins.map(async (plugin) => {
        if (!fs.existsSync("./plugins/" + plugin.dataValues.name + ".js")) {
          console.log(plugin.dataValues.name);
          var response = await got(plugin.dataValues.url);
          if (response.statusCode == 200) {
            fs.writeFileSync(
              "./plugins/" + plugin.dataValues.name + ".js",
              response.body
            );
            require(__dirname+"/plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("⬇️  Installing Plugins...");

      fs.readdirSync(__dirname+"/plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require(__dirname+"/plugins/" + plugin);
        }
      });
      console.log("✅ Plugins Installed!");
      let str = `\`\`\`X-asena connected \nversion : ${
        require(__dirname+"/package.json").version
      }\nTotal Plugins : ${events.commands.length}\nWorktype: ${
        config.WORK_TYPE
      }\`\`\``;
      conn.sendMessage(conn.user.id, { text: str });
      if (connection === 'close') {
                    console.log('Connection closed with bot. Please put New Session ID again.')
                    Xasena().catch(err => console.log(err))
                } else {
                    /*
                     */
                }
      try {
        conn.ev.on("group-participants.update", async (data) => {
          Greetings(data, conn);
        });
        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          const ms = m.messages[0];
          let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
          if (!msg.message) return;
          if (msg.body[1] && msg.body[1] == " ") msg.body = msg.body[0] + msg.body.slice(2); 
          let text_msg = msg.body;
          if (text_msg && config.LOGS)
            console.log(
              `At : ${
                msg.from.endsWith("@g.us")
                  ? (await conn.groupMetadata(msg.from)).subject
                  : msg.from
              }\nFrom : ${msg.sender}\nMessage:${text_msg}`
            );

          events.commands.map(async (command) => {
            if (
              command.fromMe &&
              !config.SUDO.split(",").includes(
                msg.sender.split("@")[0] || !msg.isSelf
              )
            )
              return;
            let comman;
            if (text_msg) {
              comman = text_msg ? text_msg[0]+text_msg.slice(1).trim().split(" ")[0].toLowerCase() : "";
              msg.prefix = new RegExp(config.HANDLERS).test(text_msg)
                ? text_msg.split("").shift()
                : ",";
            }
            if (command.pattern && command.pattern.test(comman)) {
              var match;
              try {
                match = text_msg.replace(new RegExp(comman, "i"), "").trim();
              } catch {
                match = false;
              }
              whats = new Message(conn, msg, ms);
              command.function(whats, match, msg, conn);
            } else if (text_msg && command.on === "text") {
              whats = new Message(conn, msg, ms);
              command.function(whats, text_msg, msg, conn, m);
            } else if (
              (command.on === "image" || command.on === "photo") &&
              msg.type === "imageMessage"
            ) {
              whats = new Image(conn, msg, ms);
              command.function(whats, text_msg, msg, conn, m, ms);
            } else if (
              command.on === "sticker" &&
              msg.type === "stickerMessage"
            ) {
              whats = new Sticker(conn, msg, ms);
              command.function(whats, msg, conn, m, ms);
            }
          });
        });
      } catch (e) {
        console.log(e + "\n\n\n\n\n" + JSON.stringify(msg));
      }
    }
  });
  process.on("uncaughtException", (err) => {
    let error = err.message;
    // conn.sendMessage(conn.user.id, { text: error });
    console.log(err);
  });
}
setTimeout(() => {
  Xasena().catch(err => console.log(err));
}, 3000);