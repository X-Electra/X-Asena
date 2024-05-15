const { decodeJid } = require("..");
const config = require("../../config");
const { parsedJid } = require("../functions");
const Base = require("./Base");
const fileType = require("file-type");
const { tmpdir } = require("os");
const fs = require("fs");

class ReplyMessage extends Base {
  constructor(client, data) {
    super(client);
    if (data) this._patch(data);
  }
  _patch(data) {
    this.key = data.key;
    this.id = data.stanzaId;
    this.isBaileys = this.id.startsWith("BAE5");
    this.jid = data.participant;
    try {
      this.sudo = config.SUDO.split(",").includes(
        this.participant.split("@")[0]
      );
    } catch {
      this.sudo = false;
    }
    this.fromMe = data.participant === parsedJid(this.client.user.jid)[0];
    const { quotedMessage } = data;

    if (quotedMessage) {
      if (quotedMessage.imageMessage) {
        const imageMessage = quotedMessage.imageMessage;
        this.message = this.caption =
          imageMessage.caption === null
            ? data.message.imageMessage.caption
            : "";
        this.url = imageMessage.url;
        this.mimetype = imageMessage.mimetype;
        this.height = imageMessage.height;
        this.width = imageMessage.width;
        this.mediaKey = imageMessage.mediaKey;
        this.image = true;
      } else if (quotedMessage.extendedTextMessage) {
        this.text = quotedMessage.extendedTextMessage.text;
      } else if (quotedMessage.videoMessage) {
        const videoMessage = quotedMessage.videoMessage;
        this.message = this.caption =
          videoMessage.caption === null
            ? data.message.videoMessage.caption
            : "";
        this.url = videoMessage.url;
        this.mimetype = videoMessage.mimetype;
        this.height = videoMessage.height;
        this.width = videoMessage.width;
        this.mediaKey = videoMessage.mediaKey;
        this.video = true;
      } else if (quotedMessage.conversation) {
        this.message = this.text = quotedMessage.conversation;
      } else if (quotedMessage.stickerMessage) {
        const stickerMessage = quotedMessage.stickerMessage;
        this.sticker = { animated: stickerMessage.isAnimated };
        this.mimetype = stickerMessage.mimetype;
        this.message = stickerMessage;
      } else if (quotedMessage.audioMessage) {
        const audioMessage = quotedMessage.audioMessage;
        this.audio = audioMessage;
        this.mimetype = audioMessage.mimetype;
      } else if (quotedMessage.documentMessage) {
        const documentMessage = quotedMessage.documentMessage;
        this.document = documentMessage;
        this.mimetype = documentMessage.mimetype;
      }
    }

    return super._patch(data);
  }

  async downloadMediaMessage() {
    const buff = await this.m.quoted.download();
    const type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile(tmpdir() + type.ext, buff);
    return tmpdir() + type.ext;
  }
}

module.exports = ReplyMessage;
