const config = require("../../config");
const Base = require("./Base");

class ReplyMessage extends Base {
  constructor(client, data, msg) {
    super(client, msg);
    if ((data, msg)) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.key = data.key;
    this.id = data.stanzaId;
    this.jid = data.participant;
    this.sudo = config.SUDO.split(",").includes(data.participant.split("@")[0]);
    this.fromMe = data.fromMe;

    if (data.quotedMessage && data.quotedMessage.imageMessage) {
      this.message =
        data.quotedMessage.imageMessage.caption === null
          ? data.message.imageMessage.caption
          : "";
      this.caption =
        data.quotedMessage.imageMessage.caption === null
          ? data.message.imageMessage.caption
          : "";
      this.url = data.quotedMessage.imageMessage.url;
      this.mimetype = data.quotedMessage.imageMessage.mimetype;
      this.height = data.quotedMessage.imageMessage.height;
      this.width = data.quotedMessage.imageMessage.width;
      this.mediaKey = data.quotedMessage.imageMessage.mediaKey;
      this.image = true;
      this.video = false;
      this.sticker = false;
    } else if (data.quotedMessage && data.quotedMessage.videoMessage) {
      this.message =
        data.quotedMessage.videoMessage.caption === null
          ? data.message.videoMessage.caption
          : "";
      this.caption =
        data.quotedMessage.videoMessage.caption === null
          ? data.message.videoMessage.caption
          : "";
      this.url = data.quotedMessage.videoMessage.url;
      this.mimetype = data.quotedMessage.videoMessage.mimetype;
      this.height = data.quotedMessage.videoMessage.height;
      this.width = data.quotedMessage.videoMessage.width;
      this.mediaKey = data.quotedMessage.videoMessage.mediaKey;
      this.video = true;
    } else if (data.quotedMessage && data.quotedMessage.conversation) {
      this.message = data.quotedMessage.conversation;
      this.text = data.quotedMessage.conversation;
      this.image = false;
      this.video = false;
      this.sticker = false;
    } else if (data.quotedMessage && data.quotedMessage.stickerMessage) {
      this.sticker = { animated: data.quotedMessage.stickerMessage.isAnimated };
      this.mimetype = data.quotedMessage.stickerMessage.mimetype;
      this.message = data.quotedMessage.stickerMessage;
      this.image = false;
      this.video = false;
    } else if (data.quotedMessage && data.quotedMessage.audioMessage) {
      this.audio = data.quotedMessage.audioMessage;
      this.mimetype = data.quotedMessage.audioMessage.mimetype;
    }

    return super._patch(data);
  }
  async downloadMediaMessage() {
    let buff = await this.m.quoted.download();
    let type = await fileType.fromBuffer(buff);
    await fs.promises.writeFile("./media" + type.ext, buff);
    return "./media" + type.ext;
  }
}

module.exports = ReplyMessage;