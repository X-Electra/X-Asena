/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const config = require('../../config');
const { DataTypes } = require('sequelize');

const GreetingsDB = config.DATABASE.define('Greeting', {
    chat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function getMessage(jid = null) {
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

async function setMessage(jid = null,text = null) {
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

async function deleteMessage(jid = null,) {
    var Msg = await GreetingsDB.findAll({
        where: {
            chat: jid,
        }
    });

    return await Msg[0].destroy();
}

module.exports = {
    GreetingsDB: GreetingsDB,
    getMessage: getMessage,
    setMessage: setMessage,
    deleteMessage: deleteMessage
};