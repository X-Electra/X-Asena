const { isJidGroup } = require("@whiskeysockets/baileys");
const config = require("../../config");
const { DataTypes } = require("sequelize");

const chatDb = config.DATABASE.define("Chat", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  conversationTimestamp: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

const messageDb = config.DATABASE.define("message", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
});

const contactDb = config.DATABASE.define("contact", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const saveContact = async (jid, name) => {
  if (isJidGroup(jid)) return;
  const exists = await contactDb.findOne({ where: { jid } });
  if (exists) {
    if (exists.name === name) {
      return;
    }
    await contactDb.update({ name }, { where: { jid } });
  } else {
    await contactDb.create({ jid, name });
  }
};

const saveMessage = async (message, user) => {
  const jid = message.key.remoteJid;
  const id = message.key.id;
  const msg = message;
  await saveContact(user, message.pushName);
  let exists = await messageDb.findOne({ where: { id, jid } });
  if (exists) {
    await messageDb.update({ message: msg }, { where: { id, jid } });
  } else {
    await messageDb.create({ id, jid, message: msg });
  }
};

const loadMessage = async (id, jid) => {
  const message = await messageDb.findOne({
    where: { id, jid },
  });
  return message.dataValues;
};

const saveChat = async (chat) => {
  if (chat.id === "status@broadcast") return;
  if (chat.id === "broadcast") return;
  let isGroup = isJidGroup(chat.id);
  let chatexists = await chatDb.findOne({ where: { id: chat.id } });
  if (chatexists) {
    await chatDb.update(
      { conversationTimestamp: chat.conversationTimestamp },
      { where: { id: chat.id } }
    );
  } else {
    await chatDb.create({
      id: chat.id,
      conversationTimestamp: chat.conversationTimestamp,
      isGroup,
    });
  }
};

const getName = async (jid) => {
  const contact = await contactDb.findOne({ where: { jid } });
  return contact.name;
};
module.exports = {
  saveMessage,
  loadMessage,
  saveChat,
  getName,
};
