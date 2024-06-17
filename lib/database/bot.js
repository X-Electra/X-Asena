const config = require("../../config");
const { DataTypes } = require("sequelize");

const call = config.DATABASE.define("call", {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

async function getcall() {
  return await call.findAll();
}

async function savecall(chatId) {
  return await call.create({ chatId });
}

async function deleteAllcall() {
  return await call.destroy({
    where: {},
    truncate: true,
  });
}

module.exports = {
  call,
  getcall,
  savecall,
  deleteAllcall,
};
