const { PROCESSNAME } = require("../../config");
const { command } = require("../../lib/");
const { exec } = require("child_process");
const git = require("simple-git");
command(
  {
    pattern: "update",
    fromMe: true,
    desc: "update the bot",
    type: "user",
  },
  async (message, match) => {
    await message.sendMessage(message.jid, "_Updating..._");
    const available = await git().silent(true).pull("origin", "master");
    if (available.summary.changes) {
      await message.sendMessage(message.jid, "_Updated! Restarting..._");
      exec("pm2 restart " + PROCESSNAME, (error, stdout, stderr) => {
        if (error) {
          return message.sendMessage(message.jid, error.message);
        }
        if (stderr) {
          return message.sendMessage(message.jid, stderr);
        }
      });
    } else {
      await message.sendMessage(message.jid, "_Already up-to-date._");
    }
  }
);
