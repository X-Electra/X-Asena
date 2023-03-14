const {
  default: makeWASocket,
  Browsers,
  makeInMemoryStore,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image, Sticker, Video } = require("./lib/Classes");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const config = require("./config");
const { PluginDB } = require("./lib/database/plugins");

const { decodeJid } = require("./lib");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

fs.readdirSync(__dirname + "/lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
    require(__dirname + "/lib/database/" + plugin);
  }
});
async function Xasena() {
  const { state, saveCreds } = await useMultiFileAuthState(
    __dirname + "/session"
  );
  console.log("Syncing Database");
  await config.DATABASE.sync();
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
      },
  });
  store.bind(conn.ev);
  setInterval(() => {
    store.writeToFile("./database/store.json");
  }, 30 * 1000);

  conn.ev.on("creds.update", saveCreds);
  conn.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { id, name: contact.notify };
    }
  });
  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
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
            require(__dirname + "/plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("⬇️  Installing Plugins...");

      fs.readdirSync(__dirname + "/plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require(__dirname + "/plugins/" + plugin);
        }
      });
      console.log("✅ Plugins Installed!");
      let str = `\`\`\`X-asena connected \nversion : ${
        require(__dirname + "/package.json").version
      }\nTotal Plugins : ${events.commands.length}\nWorktype: ${
        config.WORK_TYPE
      }\`\`\``;
      conn.sendMessage(conn.user.id, { text: str });

      try {
        
        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          const ms = m.messages[0];
          let msg = await serialize(
            JSON.parse(JSON.stringify(ms)),
            conn,
            store,
            m
          );
          if (!msg.message) return;
          //console.log(JSON.stringify(msg, null, 3));
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
            if (text_msg && command.pattern && command.pattern.test(text_msg)) {
              var match;
              strings = text_msg.match(command.pattern);
              
              try {
                match = strings[4].trim();
              } catch {
                match = false;
              }
              msg.prefix = strings[1].trim();
              msg.command = strings[3].trim();
              console.log(msg.prefix,msg.command)
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
            } else if (command.on == "video" && msg.type == "videoMessage") {
              whats = new Video(conn, msg, ms);
              command.function(whats, text_msg, msg, conn, m, ms);
            }
          });
        });
      } catch (e) {
        console.log(e, "\n\n", JSON.stringify(msg));
      }
    }
    if (connection === "close") {
      console.log(s);
      console.log(
        "Connection closed with bot. Please put New Session ID again."
      );
      Xasena().catch((err) => console.log(err));
    }
  });
  process.on("uncaughtException", async (err) => {
    let error = err.message;
    await conn.sendMessage(conn.user.id, { text: error });
    console.log(err);
  });
}
Xasena().catch((err) => console.log(err));
