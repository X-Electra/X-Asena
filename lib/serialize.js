const {
    downloadContentFromMessage,
    getContentType,
  } = require("@whiskeysockets/baileys"),
  fs = require("fs");
const fetch = require("node-fetch");
const { fromBuffer } = require("file-type");
let path = require("path");
const {
  writeExifImg,
  writeExifVid,
  imageToWebp,
  videoToWebp,
} = require("./sticker");
const downloadMedia = (message, pathFile) =>
  new Promise(async (resolve, reject) => {
    let type = Object.keys(message)[0];
    let mimeMap = {
      imageMessage: "image",
      videoMessage: "video",
      stickerMessage: "sticker",
      documentMessage: "document",
      audioMessage: "audio",
    };
    let mes = message;
    if (type == "templateMessage") {
      mes = message.templateMessage.hydratedFourRowTemplate;
      type = Object.keys(mes)[0];
    }
    if (type == "buttonsMessage") {
      mes = message.buttonsMessage;
      type = Object.keys(mes)[0];
    }
    try {
      if (pathFile) {
        const stream = await downloadContentFromMessage(
          mes[type],
          mimeMap[type]
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        await fs.promises.writeFile(pathFile, buffer);
        resolve(pathFile);
      } else {
        const stream = await downloadContentFromMessage(
          mes[type],
          mimeMap[type]
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        resolve(buffer);
      }
    } catch (e) {
      reject(e);
    }
  });
async function serialize(msg, conn) {
  conn.logger = {
    ...conn.logger,
    info() {
      console.log();
    },
    error() {
      console.log();
    },
    warn() {
      console.log();
    },
  };

  if (msg.key) {
    msg.id = msg.key.id;
    msg.isSelf = msg.key.fromMe;
    msg.from = msg.key.remoteJid;
    msg.isGroup = msg.from.endsWith("@g.us");
    msg.sender = msg.isGroup
      ? msg.key.participant
      : msg.isSelf
      ? conn.user.id
      : msg.from;
  }
  if (msg.message) {
    msg.type = getContentType(msg.message);
    if (msg.type === "ephemeralMessage") {
      msg.message = msg.message[msg.type].message;
      const tipe = Object.keys(msg.message)[0];
      msg.type = tipe;
      if (tipe === "viewOnceMessage") {
        msg.message = msg.message[msg.type].message;
        msg.type = getContentType(msg.message);
      }
    }
    if (msg.type === "viewOnceMessage") {
      msg.message = msg.message[msg.type].message;
      msg.type = getContentType(msg.message);
    }

    try {
      msg.mentions = msg.message[msg.type].contextInfo
        ? msg.message[msg.type].contextInfo.mentionedJid || []
        : [];
    } catch {
      msg.mentions = false;
    }
    try {
      const quoted = msg.message[msg.type].contextInfo;
      let type;
      if (quoted&&quoted.quotedMessage) {
        if (quoted.quotedMessage["ephemeralMessage"]) {
          type = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
          msg.quoted = {
            type: type === "viewOnceMessage" ? "view_once" : "ephemeral",
            stanzaId: quoted.stanzaId,
            sender: quoted.participant,
            message:
              type === "viewOnceMessage"
                ? quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage
                    .message
                : quoted.quotedMessage.ephemeralMessage.message,
          };
        } else if (quoted.quotedMessage["viewOnceMessage"]) {
          msg.quoted = {
            type: "view_once",
            stanzaId: quoted.stanzaId,
            sender: quoted.participant,
            message: quoted.quotedMessage.viewOnceMessage.message,
          };
        } else {
          msg.quoted = {
            type: "normal",
            stanzaId: quoted.stanzaId,
            sender: quoted.participant,
            message: quoted.quotedMessage,
          };
        }

        msg.quoted.isSelf = msg.quoted.sender === conn.user.id;
        msg.quoted.mtype = Object.keys(msg.quoted.message);

        msg.quoted.text =
          msg.quoted.message[msg.quoted.mtype]?.text ||
          msg.quoted.message[msg.quoted.mtype]?.description ||
          msg.quoted.message[msg.quoted.mtype]?.caption ||
          (msg.quoted.mtype === "templateButtonReplyMessage" &&
            msg.quoted.message[msg.quoted.mtype].hydratedTemplate
              ?.hydratedContentText) ||
          msg.quoted.message[msg.quoted.mtype] ||
          "";
        msg.quoted.key = {
          id: msg.quoted.stanzaId,
          fromMe: msg.quoted.isSelf,
          remoteJid: msg.from,
        };
        msg.quoted.download = (pathFile) =>
        downloadMedia(msg.quoted.message, pathFile);
      }
    } catch (e) {
      console.log(e);
      msg.quoted = null;
    }

    try {
      msg.body =
        msg.message.conversation ||
        msg.message[msg.type].text ||
        msg.message[msg.type].caption ||
        (msg.type === "listResponseMessage" &&
          msg.message[msg.type].singleSelectReply.selectedRowId) ||
        (msg.type === "buttonsResponseMessage" &&
          msg.message[msg.type].selectedButtonId &&
          msg.message[msg.type].selectedButtonId) ||
        (msg.type === "templateButtonReplyMessage" &&
          msg.message[msg.type].selectedId) ||
        false;
    } catch {
      msg.body = false;
    }
    msg.download = (pathFile) => downloadMedia(msg.message, pathFile);
    conn.client = msg;
    conn.getFile = async (PATH, returnAsFilename) => {
      let res, filename;
      let data = Buffer.isBuffer(PATH)
        ? PATH
        : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
        ? await (res = await fetch(PATH)).buffer()
        : fs.existsSync(PATH)
        ? ((filename = PATH), fs.readFileSync(PATH))
        : typeof PATH === "string"
        ? PATH
        : Buffer.alloc(0);
      if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
      let type = (await fromBuffer(data)) || {
        mime: "application/octet-stream",
        ext: ".bin",
      };
      if (data && returnAsFilename && !filename)
        (filename = path.join(
          __dirname,
          "../" + new Date() * 1 + "." + type.ext
        )),
          await fs.promises.writeFile(filename, data);
      return {
        res,
        filename,
        ...type,
        data,
      };
    };
    /**
     *
     * @param {*} jid
     * @param {*} path
     * @param {*} quoted
     * @param {*} options
     * @returns
     */
    conn.sendImageAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };

    /**
     *
     * @param {*} jid
     * @param {*} path
     * @param {*} quoted
     * @param {*} options
     * @returns
     */
    conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
  }
  return msg;
}

module.exports = { serialize, downloadMedia };