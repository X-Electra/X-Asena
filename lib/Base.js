/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

"use strict";

const fileType = require("file-type");
const config = require("../config");
const { isUrl, getBuffer, writeExifImg, writeExifVid } = require(".");
const fs = require("fs");
class Base {
  constructor(client) {
    Object.defineProperty(this, "client", { value: client });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) {
    return data;
  }
}

class Video extends Base {
  constructor(client, data) {
    super(client);
    if (data) this._patch(data);
  }

  _patch(data) {
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.fromMe = data.key.fromMe;
    this.caption =
      data.message.videoMessage.caption === null
        ? data.message.videoMessage.caption
        : "";
    this.url = data.message.videoMessage.url;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.mimetype = data.message.videoMessage.mimetype;
    this.height = data.message.videoMessage.height;
    this.width = data.message.videoMessage.width;
    this.mediaKey = data.message.videoMessage.mediaKey;
    this.data = data;

    if (
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "quotedMessage"
      )
    ) {
      this.reply_message = new ReplyMessage(
        this.client,
        data.message.videoMessage.contextInfo
      );
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }

  async delete() {
    return await this.client.deleteMessage(this.jid, {
      id: this.id,
      remoteJid: this.jid,
      fromMe: true,
    });
  }

  async reply(text) {
    var message = await this.client.sendMessage(
      this.jid,
      text,
      MessageType.text,
      { quoted: this.data }
    );
    return new Message(this.client, message);
  }

  async sendMessage(content, type, options) {
    return await this.client.sendMessage(this.jid, content, type, options);
  }

  async sendTyping() {
    return await this.client.updatePresence(this.jid, Presence.composing);
  }

  async sendRead() {
    return await this.client.chatRead(this.jid);
  }

  async download(location = this.id) {
    await this.client.downloadAndSaveMediaMessage(this.data, location);
    return this.id + "." + this.mimetype.split("/")[1];
  }
}

class Image extends Base {
  constructor(client, data, msg) {
    super(client);
    if (data) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.isGroup = data.isGroup;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = config.SUDO.split(",").includes(this.participant.split("@")[0]);
    this.text = data.body;
    this.fromMe = data.key.fromMe;
    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;
    this.message = { key: data.key, message: data.message };

    if (data.quoted) {
      this.reply_message = data.quoted;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }
  async reply(text, opt = { withTag: true }) {
    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: this.data }
    );
  }
}
class Message extends Base {
  constructor(client, data, msg) {
    super(client,data);
    if (data) this._patch(data, msg);
  }
  _patch(data, msg) {
    this.user = this.client.user.id;
    this.key = data.key;
    this.isGroup = data.isGroup;
    this.id = data.key.id === undefined ? undefined : data.key.id;
    this.jid = data.key.remoteJid;
    this.message = { key: data.key, message: data.message };
    this.pushName = data.pushName;
    this.participant = data.sender;
    this.sudo = config.SUDO.split(",").includes(this.participant.split("@")[0]);
    this.text = data.body;
    this.fromMe = data.key.fromMe;
    this.message = msg.message;
   

    this.timestamp =
      typeof data.messageTimestamp === "object"
        ? data.messageTimestamp.low
        : data.messageTimestamp;

    if (
      data.message.hasOwnProperty("extendedTextMessage") &&
      data.message.extendedTextMessage.hasOwnProperty("contextInfo") === true &&
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "mentionedJid"
      )
    ) {
      this.mention = data.message.extendedTextMessage.contextInfo.mentionedJid;
    } else {
      this.mention = false;
    }

    if (
      data.message.hasOwnProperty("extendedTextMessage") &&
      data.message.extendedTextMessage.hasOwnProperty("contextInfo") === true &&
      data.message.extendedTextMessage.contextInfo.hasOwnProperty(
        "quotedMessage"
      )
    ) {
      this.reply_message = new ReplyMessage(
        this.client,
        data.message.extendedTextMessage.contextInfo,
        data
      );
      this.reply_message.type = data.quoted.type;
      this.reply_message.mtype = data.quoted.mtype;
      this.reply_message.key = data.quoted.key;
    } else {
      this.reply_message = false;
    }

    return super._patch(data);
  }
  async log() {
    console.log(this.data);
  }

  async reply(text, opt = {}) {
    return this.client.sendMessage(
      this.jid,
      {
        text: require("util").format(text),
        ...opt,
      },
      { ...opt, quoted: this }
    );
  }

  async sendMessage(content, opt = {}, type = "text") {
    switch (type) {
      case "text":
        {
          return this.client.sendMessage(
            this.jid,
            {
              text: content,
              ...opt,
            },
            { ...opt }
          );
        }
        break;
      case "image":
        {
          if (Buffer.isBuffer(content)) {
            return this.client.sendMessage(
              this.jid,
              { image: content, ...opt },
              { ...opt }
            );
          } else if (isUrl(content)) {
            return this.client.sendMessage(
              this.jid,
              { image: { url: content }, ...opt },
              { ...opt }
            );
          }
        }
        break;
      case "video":
        {
          if (Buffer.isBuffer(content)) {
            return this.client.sendMessage(
              this.jid,
              { video: content, ...opt },
              { ...opt }
            );
          } else if (isUrl(content)) {
            return this.client.sendMessage(
              this.jid,
              { video: { url: content }, ...opt },
              { ...opt }
            );
          }
        }
        break;
      case "button":
        {
          return await sock.sendMessage(this.jid, content);
        }
        break;
      case "sticker":
        {
          {
            opt.packname = "X-asena";
            opt.author = "Team-Electra";
            let mime = this.reply_message.mimetype.split("/")[0];

            if (mime === "video") {
              return await this.client.sendImageAsSticker(this.jid, content,opt)
            } else if (mime === "image") {
              return await this.client.sendImageAsSticker(this.jid, content,opt)
            }
          }
          return this.client.sendMessage(
            this.jid,
            {
              text: content,
              ...opt,
            },
            { ...opt }
          );
        }
        break;
    }
  }
  async send(content, opt = {}, type = "text") {
    switch (type) {
      case "text":
        {
          return this.client.sendMessage(
            this.jid,
            {
              text: content,
              ...opt,
            },
            { ...opt }
          );
        }
        break;
      case "image":
        {
          if (Buffer.isBuffer(content)) {
            return this.client.sendMessage(
              this.jid,
              { image: content, ...opt },
              { ...opt }
            );
          } else if (isUrl(content)) {
            return this.client.sendMessage(
              this.jid,
              { image: { url: content }, ...opt },
              { ...opt }
            );
          }
        }
        break;
      case "video":
        {
          if (Buffer.isBuffer(content)) {
            return this.client.sendMessage(
              this.jid,
              { video: content, ...opt },
              { ...opt }
            );
          } else if (isUrl(content)) {
            return this.client.sendMessage(
              this.jid,
              { video: { url: content }, ...opt },
              { ...opt }
            );
          }
        }
        break;
      case "button":
        {
          return await sock.sendMessage(this.jid, content);
        }
        break;
    }
  }
  async sendFromUrl(url, options = {}) {
    let buff = await getBuffer(url);
    let mime = await fileType.fromBuffer(buff);
    let type = mime.mime.split("/")[0];
    if (type === "audio") {
      options.mimetype = "audio/mpeg";
    }
    return this.client.sendMessage(
      this.jid,
      { [type]: buff, ...options },
      { ...options }
    );
  }

  async PresenceUpdate(status) {
    await sock.sendPresenceUpdate(status, this.jid);
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
}

class ReplyMessage extends Base {
  constructor(client, data, msg) {
    super(client, msg);
    if ((data, msg)) this._patch(data, msg);
  }

  _patch(data, msg) {
    this.key = data.key;
    this.id = data.stanzaId;
    this.jid = data.participant;
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
      this.sticker =false
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
      this.sticker =false
    } else if (data.quotedMessage && data.quotedMessage.stickerMessage) {
      this.sticker ={animated : data.quotedMessage.stickerMessage.isAnimated}
      this.mimetype = data.quotedMessage.stickerMessage.mimetype
      this.message = data.quotedMessage.stickerMessage;
      this.image = false;
      this.video = false;
    }

  

    return super._patch(data);
  }
}

module.exports = { Base, Image, Message, ReplyMessage, Video };
