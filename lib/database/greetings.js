

const config = require('../../config');
const { DataTypes } = require('sequelize');

const GreetingsDB = config.DATABASE.define('Greetings', {
    chat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function getWelcome(jid = null) {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid
        }
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return Msg[0].dataValues;
    }
}

async function setWelcome(jid = null,text = null) {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
        }
    });

    if (Msg.length < 1) {
        return await GreetingsDB.create({ chat: jid,message:text });
    } else {
        return await Msg[0].update({ chat: jid, message:text });
    }
}

async function delWelcome(jid = null,) {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
        }
    });

    return await Msg[0].destroy();
}

module.exports = {
    GreetingsDB,
    setWelcome,
    getWelcome,
    delWelcome
};