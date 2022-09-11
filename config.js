/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// Özel Fonksiyonlarımız
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

DATABASE_URL = process.env.DATABASE_URL === undefined ? './lib/whatsasena.db' : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);

module.exports = {
    ANTILINK: process.env.ANTI_LINK || false,
    ANTILINK_ACTION : 'kick',
    HANDLERS: process.env.HANDLERS === undefined ? '^[.!;]' : process.env.HANDLERS,
    BRANCH: 'master',
    PACKNAME:'X-asena',
    WELCOME_MSG:'{pp}Hi @user Welcome to @gname\nYou\'re our @count/513 Members ',
    GOODBYE_MSG:'Hi @user It was Nice Seeing you',
    AUTHOR:"Team-Electra",
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './lib/whatsasena.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: DEBUG }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: DEBUG }),
    SUDO: process.env.SUDO === undefined ? '918113921898,919544951258' : process.env.SUDO,
};
