const {
  default: makeWASocket,
  useSingleFileAuthState,
  Browsers,
  makeInMemoryStore,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const config = require("./config");

const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
const { decodeJid } = require("./lib");
const { bind } = require("./lib/store");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});
require('events').EventEmitter.defaultMaxListeners = 100
async function Xasena() {
  console.log("Syncing Database");
  await config.DATABASE.sync();
  const { state, saveState } = useSingleFileAuthState(
    "./media/session.json",
    pino({ level: "silent" })
  );
  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal:true,

    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
  });
  store.bind(conn.ev);
  //store.readFromFile("./database/store.json");
  setInterval(() => {
   
    store.writeToFile("./database/store.json");
    console.log("saved store");
   
  }, 30 *60* 1000);
 

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "connecting") {
      console.log("X-Asena");
      console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
    }

    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      console.log(lastDisconnect.error.output.payload);
      Xasena();
    }

    if (connection === "open") {
      conn.sendMessage(conn.user.id, { text: "connected ✔✔" });
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
            require("./plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("⬇️  Installing Plugins...");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("✅ Plugins Installed!");

      try {
        conn.ev.on("creds.update", saveState);

        conn.ev.on("group-participants.update", async (data) => {
          Greetings(data, conn);
        });
        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          let ms = m.messages[0];
          let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
          if (!msg.message) return;
          let text_msg = msg.body;
          if (text_msg) console.log(text_msg);
          events.commands.map(async (command) => {
          
            if (
              command.fromMe &&
              !config.SUDO.split(",").includes(
                msg.sender.split("@")[0] || !msg.isSelf
              )
            )
              return;
                
            if (command.pattern && command.pattern.test(text_msg)) {
              
              var match = text_msg.trim().split(/ +/).slice(1).join(" ");
              whats = new Message(conn, msg, ms);
              command.function(whats, match, msg, conn);
            } else if (command.on === "text") {
              whats = new Message(conn, msg, ms);
              command.function(whats, text_msg, msg, conn);
            } else if (
              (command.on === "image" || command.on === "photo") &&
              msg.type === "imageMessage"
            ) {
              whats = new Image(conn, msg, ms);
              command.function(whats, text_msg, msg, conn);
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
    conn.sendMessage(conn.user.id, { text: error });
    console.log(err);
  });
}

Xasena();