const config = require("../../config");
const util = require("util");
const { DataTypes } = require("sequelize");

const GeminiDB = config.DATABASE.define("Geminis", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  history: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: false,
  },
});

const saveai = async (jid, parts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gemini = await GeminiDB.findOne({ where: { jid } });
      if (!gemini) {
        await GeminiDB.create({ jid, history: parts });
      }
      let part = gemini.history;
      part.push(parts);
      return await gemini.update({ jid, history: part }).then(resolve);
    } catch (e) {
      console.log(util.format(e));
    }
  });
};

const getai = async (jid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gemini = await GeminiDB.findOne({ where: { jid } });
      if (!gemini) return resolve([]);
    } catch (e) {
      console.log(util.format(e));
      return resolve([]);
    }
  });
  
};

module.exports = { saveai, getai };
