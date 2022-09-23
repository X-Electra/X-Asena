const config = require("../../config");
const { DataTypes } = require("sequelize");

const GreetingsDB = config.DATABASE.define("Greetings", {
  chat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: { type: DataTypes.BOOLEAN, allowNull: false },
});

async function getWelcome(jid = null) {
  var Msg = await GreetingsDB.findAll({
    where: {
      chat: jid,
    },
  });

  if (Msg.length < 1) {
    return false;
  } else {
    return Msg[0].dataValues;
  }
}

async function setWelcome(jid = null, text = null) {
  var Msg = await GreetingsDB.findAll({
    where: {
      chat: jid,
    },
  });

  if (Msg.length < 1) {
    return await GreetingsDB.create({ chat: jid, message: text });
  } else {
    return await Msg[0].update({ chat: jid, message: text });
  }
}

async function delWelcome(jid = null) {
  var Msg = await GreetingsDB.findAll({
    where: {
      chat: jid,
    },
  });

  return await Msg[0].destroy();
}

async function enableWelcome(jid = null) {
  var Msg = await GreetingsDB.findAll({
    where: {
      chat: jid,
    },
  });

  if (Msg.length < 1) {
    return await GreetingsDB.create({ chat: jid, status: true });
  } else {
    return await Msg[0].update({ chat: jid, status: true });
  }
}

async function disableWelcome(jid = null) {
  var Msg = await GreetingsDB.findAll({
    where: {
      chat: jid,
    },
  });

  if (Msg.length < 1) {
    return await GreetingsDB.create({ chat: jid, status: false });
  } else {
    return await Msg[0].update({ chat: jid, message: false });
  }
}
async function getWelcomeStatus(jid = null) {
  return new Promise(async (resolve, reject) => {
    try {
      var Msg = await GreetingsDB.findAll({
        where: {
          chat: jid,
        },
      });

      if (Msg.length < 1) {
        resolve(false);
      } else {
        resolve(Msg[0].dataValues.status);
      }
    } catch {
      resolve(false);
    }
  });
}

module.exports = {
  GreetingsDB,
  setWelcome,
  getWelcome,
  delWelcome,
  enableWelcome,
  disableWelcome,
  getWelcomeStatus,
};
