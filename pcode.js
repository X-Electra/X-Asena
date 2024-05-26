const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  delay,
  generateSessionID,
} = require("baileys");
const logger = require("pino")({ level: "silent" });
const NodeCache = require("node-cache");
const { createInterface } = require("readline");
const fs = require("fs");
const question = (query) =>
  new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    });
  });

async function rmDir(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        rmDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

const startSock = async () => {
  if (fs.existsSync("session")) {
    rmDir("session");
  }
  const { state } = await useMultiFileAuthState("session");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
 let restarted = false;
  async function connect() {
    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache,
    });
    if (!sock.authState.creds.me?.id&& !restarted) {
      const phoneNumber = await question("Enter phone number: ");
      const pairingCode = await sock.requestPairingCode(phoneNumber);
      console.log(`Pairing code: ${pairingCode} `);
    }

    sock.ev.process(async (events) => {
      if (events["connection.update"]) {
        const update = events["connection.update"];
        const { connection, lastDisconnect } = update;
        const status = lastDisconnect?.error?.output?.statusCode;

        if (
          connection === "close" &&
          (status !== 403 || status !== 401 || !status)
        ) {
          if (DisconnectReason.restartRequired === status) {
            console.log("restart required");
            console.log("restarting session");
            await connect();
            restarted = true;
          }
        }

        if (connection === "open") {
          let sessionID = await generateSessionID(sock);
          console.log("Session ID Generated: ", sessionID);
          await sock.sendMessage(sock.user.id, {
            text: `Session ID Generated: ${sessionID}`,
          });
          
          await delay(5000);
          console.log(
            "session generated using pairing code run 'npm start' to start the bot"
          );
          process.exit(0);
        }
      }
    });
    process.on("unCaughtException", (err) => {
      console.log("unCaughtException", err);
      connect();
    });
    process.on("unhandledRejection", (err) => {
      console.log("unhandledRejection", err);
      connect();
    });

    return sock;
  }
  try {
    const sock = await connect();
    console.log("socket connected");
  } catch (error) {
    console.log("error", error);
  }
};

startSock();
