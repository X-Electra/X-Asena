const config = require("../../config");
const { PROCESSNAME } = require("../../config");
const { command } = require("../../lib/");
const { exec } = require("child_process");
const simplegit = require("simple-git");
const git = simplegit();

command(
  {
    pattern: "update",
    fromMe: true,
    desc: "Update the bot",
    type: "user",
  },
  async (message, match) => {
    prefix = message.prefix;
    await git.fetch();
    var branch = config.BRANCH;
    var commits = await git.log([branch + "..origin/" + branch]);
    if (match === "now") {
      if (commits.total === 0) {
        return await message.sendMessage(
          message.jid,
          "```No changes in the latest commit```"
        );
      }
      await message.sendMessage(message.jid, "*Updating...*");
      await exec("git pull origin "+config.BRANCH, async (err, stdout, stderr) => {
        if (err) {
          return await message.sendMessage(message.jid, "```" + stderr + "```");
        }
        await message.sendMessage(message.jid, "*Restarting...*");
        await exec("pm2 restart " + PROCESSNAME);
      });
    } else {
      if (commits.total === 0) {
        return await message.sendMessage(
          message.jid,
          "```No changes in the latest commit```"
        );
      } else {
        let changes = "_New update available!_\n\n";
        changes += "*Commits:* ```" + commits.total + "```\n";
        changes += "*Branch:* ```" + branch + "```\n";
        changes += "*Changes:* \n";
        commits.all.forEach((commit, index) => {
          changes += "```" + (index + 1) + ". " + commit.message + "```\n";
        });
        changes += "\n*To update, send* ```" + prefix + "update now```";
        await message.sendMessage(message.jid, changes);
      }
    }
  }
);
