const fs = require("fs").promises;

const pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  DisconnectReason,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");

const { PausedChats } = require("./assets/database");

require("events").EventEmitter.defaultMaxListeners = 15;

const path = require("path");

const { Image, Message, Sticker, Video } = require("./lib/Messages");

const config = require("./config");

const plugins = require("./lib/plugins");

const { serialize, Greetings } = require("./lib");

const logger = pino({ level: "silent" });

const store = makeInMemoryStore({ logger: logger.child({ stream: "store" }) });

const readAndRequireFiles = async (directory) => {
  const files = await fs.readdir(directory);
  return Promise.all(
    files
      .filter((file) => path.extname(file).toLowerCase() === ".js")
      .map((file) => require(path.join(directory, file)))
  );
};
const sessionPath = __dirname + "/session";

const connect = async () => {
  console.log("X-Asena");
  console.log("Syncing Database");
  config.DATABASE.sync();
  console.log("⬇  Installing Plugins...");
  await readAndRequireFiles(__dirname + "/assets/database/");
  await readAndRequireFiles(__dirname + "/assets/plugins/");
  console.log("✅ Plugins Installed!");

  const Xasena = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/session"
    );
    let conn = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Desktop"),
      downloadHistory: true,
      syncFullHistory: true,
      getMessage: async (key) =>
        (store.loadMessage(key.id) || {}).message || { conversation: null },
    });
    store.bind(conn.ev);
    setInterval(() => {
      store.writeToFile("./assets/database/store.json");
    }, 30 * 1000);
    conn.ev.on("connection.update", async (s) => {
      const { connection, lastDisconnect } = s;
      if (connection === "connecting") {
        console.log("ℹ Connecting to WhatsApp... Please Wait.");
      }

      if (connection === "open") {
        console.log("✅ Login Successful!");
        const packageVersion = require("./package.json").version;
        const totalPlugins = plugins.commands.length;
        const workType = config.WORK_TYPE;
        const str = `\`\`\`X-asena connected
  Version: ${packageVersion}
  Total Plugins: ${totalPlugins}
  Worktype: ${workType}\`\`\``;
        conn.sendMessage(conn.user.id, {
          text: str,
        });
      }

      if (connection === "close") {
        if (
          lastDisconnect.error?.output?.statusCode !==
          DisconnectReason.loggedOut
        ) {
          await delay(300);
          Xasena();
          console.log("reconnecting...");
        } else {
          console.log("connection closed\nDevice logged out.");
          await delay(3000);
          process.exit(0);
        }
      }
    });

    conn.ev.on("creds.update", saveCreds);
    conn.ev.on("messages.reaction", async (data) => {
      fs.writeFile("./tmp.txt", JSON.stringify(data,null,2).toString());
    });
    conn.ev.on("group-participants.update", async (data) => {
      Greetings(data, conn);
    });
    conn.ev.on("messages.upsert", async (m) => {
      if (m.type !== "notify") return;
      let msg = await serialize(
        JSON.parse(JSON.stringify(m.messages[0])),
        conn
      );
      let text_msg = msg.body;
      if (!msg) return;
      const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
      isResume = regex.test(text_msg);
      const chatId = msg.from;
      try {
        const pausedChats = await PausedChats.getPausedChats();
        if (
          pausedChats.some(
            (pausedChat) => pausedChat.chatId === chatId && !isResume
          )
        ) {
          return;
        }
      } catch (error) {
        console.error(error);
      }

      if (text_msg && config.LOGS)
        console.log(
          `At : ${
            msg.from.endsWith("@g.us")
              ? (await conn.groupMetadata(msg.from)).subject
              : msg.from
          }\nFrom : ${msg.sender}\nMessage:${text_msg}`
        );
      plugins.commands.map(async (command) => {
        if (
          command.fromMe &&
          !config.SUDO.split(",").includes(
            msg.sender.split("@")[0] || !msg.isSelf
          )
        ) {
          return;
        }

        let comman = text_msg;
        msg.prefix = new RegExp(config.HANDLERS).test(text_msg)
          ? text_msg[0].toLowerCase()
          : "!";
        let whats;
        switch (true) {
          case command.pattern && command.pattern.test(comman):
            let match;
            try {
              match = text_msg
                .replace(new RegExp(command.pattern, "i"), "")
                .trim();
            } catch {
              match = false;
            }
            whats = new Message(conn, msg);
            command.function(whats, match, msg, conn);
            break;

          case text_msg && command.on === "text":
            whats = new Message(conn, msg);
            command.function(whats, text_msg, msg, conn, m);
            break;

          case command.on === "image" || command.on === "photo":
            if (msg.type === "imageMessage") {
              whats = new Image(conn, msg);
              command.function(whats, text_msg, msg, conn, m);
            }
            break;

          case command.on === "sticker":
            if (msg.type === "stickerMessage") {
              whats = new Sticker(conn, msg);
              command.function(whats, msg, conn, m);
            }
            break;
          case command.on === "video":
            if (msg.type === "videoMessage") {
              whats = new Video(conn, msg);
              command.function(whats, msg, conn, m);
            }
            break;

          default:
            break;
        }
      });
    });
    process.on("uncaughtException", async (err) => {
      await conn.sendMessage(conn.user.id, { text: err.message });
    });
    return conn;
  };
  try {
    await Xasena();
  } catch (error) {
    console.log(error);
  }
};

setTimeout(async () => {
  await connect();
}, 100);
