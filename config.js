/* Copyright (C) 2022 X-Electra.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

X-asena X-Electra
*/

const { Sequelize } = require("sequelize");
const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

const toBool = (x) => x == "true";

DATABASE_URL = 'postgres://hpeoygjaomppvl:b51569604bdfb0d67ce0e8c03833953be939724a333244b23049e7bf91abb80c@ec2-44-207-253-50.compute-1.amazonaws.com:5432/d4sdgjfjo46d5h' || "./lib/database.db";

module.exports = {
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  ANTILINK_ACTION: "kick",
  HANDLERS: process.env.HANDLERS || "^[,]",
  BRANCH: "master",
  PACKNAME: process.env.PACKNAME || "X-asena",
  WELCOME_MSG:
    process.env.WELCOME_MSG ||
    "{pp}Hi @user Welcome to @gname\nYou're our @count/513 Members ",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "Hi @user It was Nice Seeing you",
  AUTHOR: process.env.AUTHOR || "Team-Electra",
  DATABASE_URL: DATABASE_URL,
  DATABASE:
    DATABASE_URL === "./lib/database.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: false,
        })
      : new Sequelize(DATABASE_URL, {
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
          logging: false,
        }),
  SUDO: process.env.SUDO || "918113921898,919544951258",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || " ",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || " ",
  WORK_TYPE: process.env.WORK_TYPE || "public",
};
