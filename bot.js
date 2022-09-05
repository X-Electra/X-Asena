/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/
const {
  default: makeWASocket,
  useSingleFileAuthState,
  Browsers,
} = require("@adiwajshing/baileys");

const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const { DataTypes } = require("sequelize");
const got = require("got");
const config = require("./config");

const { PluginDB } = require("./lib/database/plugins");
const { parseJid } = require("./lib");
async function whatsAsena() {
  await config.DATABASE.sync();
  const { state, saveState } =  useSingleFileAuthState(
    "./media/hehe.json",
    pino({ level: "silent" })
  );
 
  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: false,
    downloadHistory: false,
  });

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "connecting") {
      console.log("X-Asena");
      console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
    }

    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      console.log(lastDisconnect.error.message);
      whatsAsena();
    }
    if (connection === "open") {
      conn.sendMessage(conn.user.id, { text: "connected ✔✔" });
      console.log("✅ Login Successful!");
      console.log("⬇️ Installing External Plugins...");

      let plugins = await PluginDB.findAll();
      plugins.map(async (plugin) => {
        if (!fs.existsSync("./plugins/" + plugin.dataValues.name + ".js")) {
          console.log(plugin.dataValues.name);
          var response = await got(plugin.dataValues.url);
          if (response.statusCode == 200) {
            fs.writeFileSync(
              "./plugins/" + plugin.dataValues.name + ".js",
              response.body
            );
            require("./plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("⬇️  Installing Plugins...");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("✅ Plugins Installed!");

      try {
        conn.ev.on("creds.update", saveState);
        conn.ev.on("group-participants.update", async (data) => {
          let metadata = await conn.groupMetadata(data.id)
          for(let user of data.participants){
            let userpp 
            try{
              userpp = await conn.profilePictureUrl(user, 'image')
            }catch{
              userpp = 'https://getwallpapers.com/wallpaper/full/3/5/b/530467.jpg'
            }
          switch (data.action) {
            case "add":
              {
let welcome_message = config.WELCOME_MSG
let msg = welcome_message.replace(/@user/gi,'@'+user.split('@')[0]).replace(/@gname/gi,metadata.subject).replace(/@count/gi,metadata.participants.length)
if(/{pp}/.test(msg)){
conn.sendMessage(data.id,{image:{url:userpp},caption:msg.replace(/{pp}/,''),mentions:parseJid(msg)})
}else{
  conn.sendMessage(data.id,{text:msg,mentions:parseJid(msg)})
}
              }
              break;
            case "remove":
              {
                let GOODBYE_MSG = config.GOODBYE_MSG
let msg = GOODBYE_MSG.replace(/@user/gi,'@'+user.split('@')[0]).replace(/@gname/gi,metadata.subject).replace(/@count/gi,metadata.participants.length)
if(/{pp}/.test(msg)){
conn.sendMessage(data.id,{image:{url:userpp},caption:msg.replace(/{pp}/,''),mentions:parseJid(msg)})
}else{
  conn.sendMessage(data.id,{text:msg,mentions:parseJid(msg)})
}
              }
              break;
          }}
        });
        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          let ms = m.messages[0];
          let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
          if (!msg.message) return;
          let text_msg = msg.body;
          console.log(text_msg);
          events.commands.map(async (command) => {
            if (command.pattern.test(text_msg)) {
              var match = text_msg.match(command.pattern)[1] || false;
              whats = new Message(conn, msg, ms);

              process.on("uncaughtException", (err) => {
                let error = err.message;
                whats.reply(error);
                console.log(err);
              });
              try {
                command.function(whats, match, msg, conn);
              } catch (error) {
                let str = `Error Occured\n\n\nError : ${error}\n\nMessage : ${text_msg}`;
                console.log(str);
                /*await conn.sendMessage(
                  '120363023247571412@g.us',
                  { text: str },
                  { ephemeralExpiration: 86400 }
                );*/
              }
            }
          });
        });
      } catch (e) {
        console.log(e + "\n\n\n\n\n" + JSON.stringify(msg));
      }
    }
  });
}

whatsAsena();
