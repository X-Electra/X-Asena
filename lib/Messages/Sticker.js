const Base = require("./Base");

class Sticker extends Base {
  constructor(client, data) {
    super(client, data);
  }

  _patch(data) {
    super._patch(data);
    this.message = data.message.stickerMessage;
    this.sticker = true;
    return this;
  }

  async downloadMediaMessage() {
    let buff = await this.m.download();
    let name = new Date().getTime().toString();
    await fs.promises.writeFile(name, buff);
    return name;
  }

}

module.exports = Sticker;