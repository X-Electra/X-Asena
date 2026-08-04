import fs from "fs/promises";
import path from "path";
import http from "http"; // <-- Added for Koyeb health check
import connect from "./src/socket/connection.js";
import { commands } from "./src/plugins.js";
import { initTerminalHandler } from "./src/terminal/handler.js";
import { useMultiDbAuthState, checkAuthCreds } from "./src/database/authState.js";
import config from "./config.js";
import './install-ffmpeg.js';

// <-- Koyeb Health Check Server (Starts immediately) -->
http.createServer((req, res) => res.end('X-Asena is running!')).listen(process.env.PORT || 8000);

global.__basedir = path.resolve();

const readAndRequireFiles = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    const jsFiles = files.filter((file) => file.endsWith(".js"));
    await Promise.all(
      jsFiles.map((file) =>
        import(`file://${path.join(directory, file).replace(/\\/g, "/")}`)
      )
    );
  } catch (error) {
    console.error("Error loading files:", error);
    throw error;
  }
};

const initialize = async () => {
  console.log("\n╔══════════════════════════════╗");
  console.log("║        X-Asena v4.0.0       ║");
  console.log("║   Baileys 7.0.0-rc13        ║");
  console.log("╚══════════════════════════════╝\n");

  try {
    // Init auth backend early (creates table / opens DB)
    console.log(
      config.USE_POSTGRES
        ? "⏳ Initializing Postgres auth..."
        : `⏳ Initializing SQLite auth (${config.SQLITE_PATH})...`
    );
    await useMultiDbAuthState();

    const credsCheck = await checkAuthCreds();
    if (credsCheck.hasCreds) {
      console.log("✅ Credentials found");
    } else if (process.env.PAIRING_NUMBER) {
      console.log(
        `ℹ️  No credentials — pairing code login (${process.env.PAIRING_NUMBER.replace(/\D/g, "")})`
      );
    } else {
      console.log(
        "ℹ️  No credentials — QR login (or set PAIRING_NUMBER for code login)"
      );
    }

    // Load plugins (skip database folder auto-import — auth is factory-based)
    await readAndRequireFiles(path.join(global.__basedir, "src/plugins"));
    console.log(`✅ ${commands.length} Plugins Loaded!`);

    initTerminalHandler();

    // Optional enterprise admin HTTP (localhost + token)
    try {
      const { startAdminHttp } = await import("./src/enterprise/adminHttp.js");
      startAdminHttp();
    } catch (err) {
      console.warn("Admin HTTP not started:", err?.message || err);
    }

    console.log("⏳ Connecting to WhatsApp...\n");
    await connect();
  } catch (error) {
    console.error("❌ Initialization error:", error);
    process.exit(1);
  }
};

initialize();
