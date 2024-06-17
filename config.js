const { Sequelize } = require("sequelize");
const fs = require("fs");
const { existsSync } = require("fs");
const dotenv = require("dotenv");
const DATABASE_URL = process.env.DATABASE_URL || "./database.db";
if (existsSync('.env')) {
  dotenv.config({ path: './.env' });
}
process.env.NODE_OPTIONS = "--max_old_space_size=2560";
const toBool = (x) => x === "true";

module.exports = {
  LOGS: toBool(process.env.LOGS) || true,
  SESSION_ID: process.env.SESSION_ID || null,
  LANG: process.env.LANG || "EN",
  AUTH_TOKEN: "",
  HANDLERS: process.env.HANDLERS === "false" || process.env.HANDLERS === "null"
    ? "^"
    : "^[#.,]",
  RMBG_KEY: process.env.RMBG_KEY || "",
  BRANCH: "main",
  WARN_COUNT: 3,
  PACKNAME: process.env.PACKNAME || "alpha",
  WELCOME_MSG: process.env.WELCOME_MSG || "Hi @user Welcome to @gname",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "Hi @user It was Nice Seeing you",
  AUTHOR: process.env.AUTHOR || "X-Electra",
  SUDO: process.env.SUDO || "2348114860536,2349137982266,2349167415127",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  OWNER_NAME: process.env.OWNER_NAME || "Neeraj-X0",
  HEROKU: toBool(process.env.HEROKU) || false,
  BOT_NAME: process.env.BOT_NAME || "alpha",
  AUTO_READ: toBool(process.env.AUTO_READ) || false,
  DIS_START_MSG: toBool(process.env.DIS_START_MSG) || true,
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE) || false,
  PROCESSNAME: process.env.PROCESSNAME || "alpha",
  WORK_TYPE: process.env.WORK_TYPE || "private",
  TZ: process.env.TZ || "Africa/Lagos",
  SESSION_ID: process.env.SESSION_ID || "",
  DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
  DATABASE_URL: DATABASE_URL,
  STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
  DATABASE: DATABASE_URL === "./database.db"
    ? new Sequelize({
        dialect: "sqlite",
        storage: DATABASE_URL,
        logging: false,
      })
    : new Sequelize(DATABASE_URL, {
        dialect: "postgres",
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        logging: false,
      }),
};
