const config = require("../../config");
const { DataTypes } = require("sequelize");

const ScheduleDB = config.DATABASE.define("schedule", {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobFunction: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = ScheduleDB;
