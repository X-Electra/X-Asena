const Base = require("./Base");
const { tmpdir } = require("os");
const fs = require("fs");

class ReplyMessage extends Base {
  constructor(client, data) {
    super(client, data);
  }

  _patch(data) {
    super._patch(data);
    this.id = data.stanzaId;
    const { quotedMessage } = data;
    if (quotedMessage) {
      let type = Object.keys(quotedMessage)[0];
      if (type === "extendedTextMessage" || type === "conversation") {
        this.text = quotedMessage[type].text || quotedMessage[type];
        this.mimetype = "text/plain";
      } else if (type === "stickerMessage") {
        this.mimetype = "image/webp";
        this.sticker = quotedMessage[type];
      } else {
        let mimetype = quotedMessage[type]?.mimetype || type;
        if (mimetype?.includes("/")) {
          this.mimetype = mimetype;
          let mime = mimetype.split("/")[0];
          this[mime] = quotedMessage[type];
        } else {
          this.mimetype = mimetype;
          this.message = quotedMessage[type];
        }
      }
    }
    return this;
  }

  async downloadMediaMessage() {
    const buff = await this.m.quoted.download();
    const type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile(tmpdir() + type.ext, buff);
    return tmpdir() + type.ext;
  }
}

module.exports = ReplyMessage;
