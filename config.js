const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();
const toBool = (x) => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./assets/database.db";
module.exports = {
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  LOGS: toBool(process.env.LOGS) || true,
  ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
  SESSION_ID: process.env.SESSION_ID ||eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSU5JRnEranhFZElFQVlScjJPZkRIRncrWG1JMUNoeUVXZjhXa0lWbVFYZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUlmZndqbkQrVEs4UkdFeEk1RGVCbnBRYlloTjRRL1lBOExHcGhza3Rrbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwSFBIOVIwcERUR3ZNT3h5YjJZcnFOZlNyMTUxTFgzZ2hDWlFiZ3JKR0VvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJSNzF0NmNVenBGMGRjR3VtQWhkcE9NUnpYQ3hXZlBVWXl3QjNDK0ZsZkhNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVOc0crZ2pqT0hlOG1yYUp4cGl1bit3ekF2K05rUjB2ZTlQc3o0eXVFRjQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImR1Qk40ZWthRFBDZjkvL2pZMGdyamRyV1JVTlF2ZFFSMEVtS0dqa3Yvakk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0tEaU9PL1BadEZSM3FtWWx2VXFwOVc1dUFUclNjM0MwdHd1MTNsczQwUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0NqM2pSTXA1MUZPbStKUWVEcXNoUzdLajRCN0VjUGZ0aEZybjFIbG1DVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InhnYmM2TFIza096VGxScmd1b3E5SngxbStVeGF3dVVRYTR0VllmVVpXcTVyeEVpM0U5ZTk2OE95Y2xHdkhVTU1xOWZCQmh1TThVU0NYTnJMRHBMeUJnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjMsImFkdlNlY3JldEtleSI6IjRyUTl4OTZVMlZGaFg3WFR6VnViY05YdFloNWM3bThoMzNQWVN2cnIvaEU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiOTE2MjgyNTg5MDIwQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkIzMjUwNDdGOTVDRDMzNTNCQzc0RjIzNjgzMzRDNDlBIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MjMyMTE5MjB9LHsia2V5Ijp7InJlbW90ZUppZCI6IjkxNjI4MjU4OTAyMEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI1MzNBMTgxOTE2Nzg1MzlFOEU2MjMzRDg4MjYwRkM4QSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzIzMjExOTIwfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MTYyODI1ODkwMjBAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiRjFGMjUxQjU5QzVFNzY2QzIxNjE4RkJFNDQyMENDMTQifSwibWVzc2FnZVRpbWVzdGFtcCI6MTcyMzIxMTkyMX0seyJrZXkiOnsicmVtb3RlSmlkIjoiOTE2MjgyNTg5MDIwQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkY5NTEzN0NEQUI3QzZFQjU0MjQ5MTEyNTM1QTcwNjY0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MjMyMTE5MjF9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImRCZGpRSFkxU3VXa0hDT01rTlJCSHciLCJwaG9uZUlkIjoiNGQwYzI4MDgtNmNmMy00M2U5LWJmYmMtNzBkN2NiZjYwNWQ2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFEYUVVUld0LzkzeS9xZzFUdjZnd3QrVEVqND0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2NW01T0lUajZHcUVwYnRudFpqYnJmYXlDb3M9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTlFTNllMQVQiLCJtZSI6eyJpZCI6IjkxNjI4MjU4OTAyMDoyMUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJ5dWl0by4uLiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTGFtd0V3UWdjSFl0UVlZQVNBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiYXc3c09WMUJ6ZThWQTFlak9KaG9oeHhNaE53TUlTY3ZXclp6SEZWNldVZz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTnN4cHc5V1lBS1lHQjRoeTQ0Rlp2SHlURjJ6OC82aFI5ZWlDYnlMbElFeGtma0Zpb3VsS2VzbTREaXJ1L3RMM3U4bjVLUjY3SFJWMS9VZTZFSjRURGc9PSIsImRldmljZVNpZ25hdHVyZSI6Im9LMUNxSXN1bE41S0dJeU5sVHg3MlVnc0l3cDM3ajFlaTArYnNKME51bzRrSGI3MmR1K3Z5UW92TzNTN2NTMi9rNnZOcGUrTnhJUU56UllxUTZlbUR3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTE2MjgyNTg5MDIwOjIxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQldzTzdEbGRRYzN2RlFOWG96aVlhSWNjVElUY0RDRW5MMXEyY3h4VmVsbEkifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjMyMTE5MTgsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTmpjIn0=,
  LANG: process.env.LANG || "EN",
  AUTH_TOKEN: "",
  HANDLERS:
    process.env.HANDLER === "false" || process.env.HANDLER === "null"
      ? "^"
      : "[#]",
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: "main",
  WARN_COUNT: 3,
  PACKNAME: process.env.PACKNAME || "X-Asena",
  WELCOME_MSG: process.env.WELCOME_MSG || "Hi @user Welcome to @gname",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "Hi @user It was Nice Seeing you",
  AUTHOR: process.env.AUTHOR || "X-Electra",
  SUDO:
    process.env.SUDO || "918113921898,919598157259,918590508376,919383400679",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  OWNER_NAME: process.env.OWNER_NAME || "Neeraj-X0",
  HEROKU: toBool(process.env.HEROKU) || false,
  BOT_NAME: process.env.BOT_NAME || "X-Asena",
  AUTO_READ: toBool(process.env.AUTO_READ) || false,
  AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
  PROCESSNAME: process.env.PROCESSNAME || "x-asena",
  WORK_TYPE: process.env.WORK_TYPE || "private",
  SESSION_URL: process.env.SESSION_URL || "",
  DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
  REMOVEBG: process.env.REMOVEBG || false,
  DATABASE_URL: DATABASE_URL,
  STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
  DATABASE:
    DATABASE_URL === "./assets/database.db"
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
};
