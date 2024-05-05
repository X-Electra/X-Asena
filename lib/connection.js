const fs = require("fs").promises;
const pino = require("pino");
const path = require("path");
const axios = require("axios");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  DisconnectReason,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const { PausedChats } = require("../assets/database");
const config = require("../config");
const plugins = require("./plugins");
const { serialize, Greetings } = require("./index");
const { Image, Message, Sticker, Video } = require("./Messages");
const {
  loadMessage,
  saveMessage,
  saveChat,
} = require("../assets/database/StoreDb");
const { parsedJid } = require("./functions");

// Set up logging
const logger = pino({ level: "silent" });

const connect = async () => {
  const Xasena = async () => {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__basedir, "session")
      );

      let conn = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: logger,
        browser: Browsers.macOS("Desktop"),
        downloadHistory: false,
        syncFullHistory: false,
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
          console.log("✅ Login Successful!");
          const packageVersion = require("../package.json").version;
          const totalPlugins = plugins.commands.length;
          const workType = config.WORK_TYPE;
          const str = `\`\`\`X-asena connected\nVersion: ${packageVersion}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\`\`\``;
          conn.sendMessage(conn.user.id, { text: str });
          setInterval(async () => {
            await conn.sendPresenceUpdate("unavailable");
          }, 10 * 1000);
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
        await saveMessage(m.messages[0],msg.sender);
        let text_msg = msg.body;
        if (text_msg == "quoted") {
          return conn.sendMessage(msg.from, {
            text: JSON.stringify(msg.quoted),
          });
        }
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
        if (text_msg && config.LOGS) {
          console.log(
            `At : ${
              msg.from.endsWith("@g.us")
                ? (await conn.groupMetadata(msg.from)).subject
                : msg.from
            }\nFrom : ${msg.sender}\nMessage:${text_msg}`
          );
        }

        await Promise.all(
          plugins.commands.map(async (command) => {
            if (
              command.fromMe &&
              !config.SUDO.split(",").includes(
                parsedJid(msg.sender)[0].split("@")[0]
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
          })
        );
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

  // Call the Xasena function
  try {
    await Xasena();
  } catch (error) {
    console.error("Xasena function error:", error);
  }
};

// Event listener for SIGINT signal
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Exiting...");
  // Perform necessary cleanup

  // Exit the process
  process.exit(0);
});

module.exports = connect;
