"use strict";
const config = require("../../config");
const { getBuffer, isUrl, decodeJid, parsedJid } = require("../functions");
const fileType = require('file-type');
const { generateWAMessageFromContent, generateWAMessage } = require("baileys");

class Base {
  constructor(client, data) {
    Object.defineProperty(this, "client", { value: client });
    if (data) this._patch(data);
  }

  _patch(data) {
    this.user = decodeJid(this.client.user.id);
    this.key = data.key;
    this.isGroup = data.isGroup;
    this.id = data.key.id;
    this.jid = data.key.remoteJid;
    this.pushName = data.pushName;
    this.participant = parsedJid(data.sender)[0];
    this.fromMe = data.key.fromMe;
    this.timestamp = typeof data.messageTimestamp === "object"
      ? data.messageTimestamp.low
      : data.messageTimestamp;
    this.isBaileys = this.id.startsWith("BAE5");
    try {
      this.sudo = config.SUDO.split(",").includes(
        this.participant.split("@")[0]
      );
    } catch {
      this.sudo = false;
    }

    return data;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  async sendFile(content, options = {}) {
    let { data } = await this.client.getFile(content);
    let type = await fileType.fromBuffer(data);
    return this.client.sendMessage(
      this.jid,
      { [type.mime.split("/")[0]]: data, ...options },
      { ...options }
    );
  }

  async reply(text, opt = {}) {
    return this.client.sendMessage(
      this.jid,
      { text: require("util").format(text), ...opt },
      { ...opt, quoted: this }
    );
  }

  async send(jid, text, opt = {}) {
    const recipient = jid.endsWith("@s.whatsapp.net") ? jid : this.jid;
    return this.client.sendMessage(
      recipient,
      { text: require("util").format(text), ...opt },
      { ...opt }
    );
  }

  async sendMessage(
    jid,
    content,
    opt = { packname: "Xasena", author: "X-electra" },
    type = "text"
  ) {
    const recipient = jid || this.jid;
    switch (type.toLowerCase()) {
      case "text":
        return this.client.sendMessage(recipient, { text: content, ...opt });
      case "image":
      case "video":
      case "audio":
        if (Buffer.isBuffer(content)) {
          return this.client.sendMessage(recipient, { [type]: content, ...opt });
        } else if (isUrl(content)) {
          return this.client.sendMessage(recipient, { [type]: { url: content }, ...opt });
        }
        break;
      case "template":
        const optional = await generateWAMessage(recipient, content, opt);
        const message = {
          viewOnceMessage: {
            message: {
              ...optional.message,
            },
          },
        };
        await this.client.relayMessage(recipient, message, {
          messageId: optional.key.id,
        });
        break;
      case "sticker":
        // Implement sticker logic here
        break;
    }
  }

  async forward(jid, message, options = {}) {
    let m = generateWAMessageFromContent(jid, message, {
      ...options,
      userJid: this.client.user.id,
    });
    await this.client.relayMessage(jid, m.message, {
      messageId: m.key.id,
      ...options,
    });
    return m;
  }

  async delete(key) {
    await this.client.sendMessage(this.jid, { delete: key });
  }

  async updateName(name) {
    await this.client.updateProfileName(name);
  }

  async getPP(jid) {
    return await this.client.profilePictureUrl(jid, "image");
  }

  async setPP(jid, pp) {
    if (Buffer.isBuffer(pp)) {
      await this.client.updateProfilePicture(jid, pp);
    } else {
      await this.client.updateProfilePicture(jid, { url: pp });
    }
  }

  async block(jid) {
    await this.client.updateBlockStatus(jid, "block");
  }

  async unblock(jid) {
    await this.client.updateBlockStatus(jid, "unblock");
  }

  async add(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "add");
  }

  async kick(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "remove");
  }

  async promote(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "promote");
  }

  async demote(jid) {
    return await this.client.groupParticipantsUpdate(this.jid, jid, "demote");
  }
}

module.exports = Base;