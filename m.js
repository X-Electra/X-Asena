const pino = require("pino");
const { Boom } = require("@hapi/boom");
const path = require("path");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  delay,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("baileys");
const { PausedChats } = require("./database");
const config = require("../config");
const plugins = require("./plugins");
const { serialize, Greetings } = require("./index");
const { Image, Message, Sticker, Video, AllMessage } = require("./Messages");
const {
  loadMessage,
  saveMessage,
  saveChat,
  getName,
} = require("./database/Store");
const { getcall } = require("./database/bot");
const fs = require("fs");
const logger = pino({ level: "silent" });

const bot = async () => {
  if (!fs.existsSync("./session")) fs.mkdirSync("./session");

  const Alpha = async () => {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__basedir, "session"),
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
          console.log("✅ Login Successful!");
          const packageVersion = require("../package.json").version;
          const totalPlugins = plugins.commands.length;
          const workType = config.WORK_TYPE;
          const str = `\`\`\`Alpha connected\nVersion: ${packageVersion}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\`\`\``;
          if (!config.DIS_START_MSG) {
            conn.sendMessage(conn.user.id, { text: str });
          }
        }
        if (connection === "close") {
          if (
            lastDisconnect.error?.output?.statusCode !==
            DisconnectReason.loggedOut
          ) {
            await delay(300);
            Alpha();
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
        if (m.messages[0]?.messageStubType) {
          const jid = m.messages[0]?.key.remoteJid;
          const participant = m.messages[0].messageStubParameters[0];
          const actor = m.messages[0]?.participant;
          if (!jid || !participant || !actor) return;
          const botJid = jidNormalizedUser(conn.user.id);
          const groupMetadata = await conn.groupMetadata(jid).catch((e) => {
            participants: [];
          });
          const admins = (jid) =>
            groupMetadata.participants
              .filter((v) => v.admin !== null)
              .map((v) => v.id)
              .includes(jid);
          if (
            m.messages[0].messageStubType ==
            proto?.WebMessageInfo?.StubType?.GROUP_PARTICIPANT_DEMOTE
          ) {
            if (config.PDM == "true") {
              await conn.sendMessage(jid, {
                text:
                  "_" +
                  `@${actor.split("@")[0]} demoted @${participant.split("@")[0]} from admin` +
                  "_",
                mentions: [actor, participant],
              });
            }
          } else if (
            m.messages[0].messageStubType ==
            proto?.WebMessageInfo?.StubType?.GROUP_PARTICIPANT_PROMOTE
          ) {
            if (pdm == "true") {
              await conn.sendMessage(jid, {
                text:
                  "_" +
                  `@${actor.split("@")[0]} promoted @${participant.split("@")[0]} as admin` +
                  "_",
                mentions: [actor, participant],
              });
            }
          }
        }
        if (m.type !== "notify") return;
        let msg = await serialize(
          JSON.parse(JSON.stringify(m.messages[0])),
          conn,
        );
        await saveMessage(m.messages[0], msg.sender);
        if (config.AUTO_READ) {
          await conn.readMessages(msg.key);
        }
        config.ALWAYS_ONLINE
          ? await conn.sendPresenceUpdate("available", m.jid)
          : await conn.sendPresenceUpdate("unavailable", m.jid);
        if (config.STATUS_VIEW && msg.from === "status@broadcast") {
          await conn.readMessages(msg.key);
        }
        let text_msg = msg.body;
        if (!msg) return;
        const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
        isResume = regex.test(text_msg);
        const chatId = msg.from;
        try {
          const pausedChats = await PausedChats.getPausedChats();
          if (
            pausedChats.some(
              (pausedChat) => pausedChat.chatId === chatId && !isResume,
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
            }\nFrom : ${name}\nMessage:${text_msg ? text_msg : msg.type}`,
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
                whats.messageId = msg.message.protocolMessage.key?.id;
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

      conn.ev.on("call", async (callEvent) => {
        const callList = await getcall();
        if (!Array.isArray(callEvent) || callEvent.length === 0) {
          console.log("No call data received.");
          return;
        }
        const call = callEvent[0];
        let { status, from, id } = call;

        let frmid;
        if (from.includes(":")) {
          frmid = from.split(":")[0];
        } else {
          frmid = from.split("@")[0];
        }

        let res = callList.some(
          (item) =>
            item.dataValues && item.dataValues.chatId.split("@")[0] === frmid,
        );

        console.log("[Call from: " + frmid + "]");

        if (status === "offer") {
          if (!res) {
            await conn.rejectCall(id, from);
            await conn.sendMessage(from, {
              text: "Sorry, no calls allowed. Please use text or voice message.\n> Automated System",
            });
          }
        }
      });

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
    await Alpha();
  } catch (error) {
    console.error("Alpha function error:", error);
  }
};

module.exports = bot;

// SIGINT handler
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Exiting...");
  process.exit(0);
});
