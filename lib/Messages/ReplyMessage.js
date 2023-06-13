const config = require('../../config');
const Base = require("./Base");
const fileType = require('file-type');
const fs = require('fs');

class ReplyMessage extends Base {
  constructor(client, data) {
    super(client);
    if (data) this._patch(data);
  }

  _patch(data) {
    this.key = data.key;
    this.id = data.stanzaId;
    this.jid = data.participant;
    this.sudo = config.SUDO.split(",").includes(data.participant.split("@")[0]);
    this.fromMe = data.fromMe;

    const { quotedMessage } = data;

    if (quotedMessage) {
      if (quotedMessage.imageMessage) {
        const imageMessage = quotedMessage.imageMessage;
        this.message = this.caption = imageMessage.caption === null ? data.message.imageMessage.caption : "";
        this.url = imageMessage.url;
        this.mimetype = imageMessage.mimetype;
        this.height = imageMessage.height;
        this.width = imageMessage.width;
        this.mediaKey = imageMessage.mediaKey;
        this.image = true;
      } 
      else if (quotedMessage.extendedTextMessage) {
        this.text = quotedMessage.extendedTextMessage.text;
      }else if (quotedMessage.videoMessage) {
        const videoMessage = quotedMessage.videoMessage;
        this.message = this.caption = videoMessage.caption === null ? data.message.videoMessage.caption : "";
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
      }
    }

    return super._patch(data);
  }

  async downloadMediaMessage() {
    const buff = await this.m.quoted.download();
    const type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile("./media" + type.ext, buff);
    return "./media" + type.ext;
  }
}

module.exports = ReplyMessage;
