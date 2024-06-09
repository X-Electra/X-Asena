const config = require("../../config");
const util = require("util");
const { DataTypes } = require("sequelize");

const banBotDb = config.DATABASE.define("banbot", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ban: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const isBanned = async (jid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ban = await banBotDb.findOne({ where: { jid } });
      return resolve(ban ? ban.ban : false);
    } catch (e) {
      console.log(util.format(e));
    }
  });
};

const banUser = async (jid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ban = await banBotDb.findOne({ where: { jid } });
      if (ban) {
        await ban.update({ ban: true });
      } else {
        await banBotDb.create({ jid, ban: true });
      }
      return resolve(true);
    } catch (e) {
      console.log(util.format(e));
    }
  });
};

const unbanUser = async (jid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ban = await banBotDb.findOne({ where: { jid } });
      if (ban) {
        await ban.update({ ban: false });
      } else {
        await banBotDb.create({ jid, ban: false });
      }
      return resolve(true);
    } catch (e) {
      console.log(util.format(e));
    }
  });
};

module.exports = { isBanned, banUser, unbanUser };
