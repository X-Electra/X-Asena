const { alpha, isAdmin, parsedJid, config } = require("../lib/");
const { groupDB } = require("../lib/database/group");
const { getWarns, saveWarn, resetWarn } = require("../lib/database/warn");
const WARN_NO = config.WARN_COUNT;

function containsLink(message) {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  return urlPattern.test(message.text);
}

function containsBannedWord(message, bannedWords) {
  const words = message.text.split(/\s+/);
  return words.some((word) => bannedWords.includes(word.toLowerCase()));
}

alpha(
  {
    on: "message",
    fromMe: false,
    dontAddcommandList: true,
  },
  async (message) => {
    //  console.log("ashyflkahf", message);
    const userId = parsedJid(message.participant);
    const isadmin = await isAdmin(message.jid, userId, message.client);
    if (isadmin) return;

    const settings = await groupDB(
      ["antibot", "antilink", "antiword"],
      { jid: message.jid },
      "get",
    );

    if (settings.antibot && settings.antibot.status === "true") {
      if (!message.isBaileys) return;
      const action = settings.antibot.action;
      const warnInfo = (await getWarns(userId)) || {
        warnCount: 0,
        reasons: [],
      };

      if (action === "warn") {
        warnInfo.warnCount += 1;
        warnInfo.reasons.push("Using bot");
        await saveWarn(userId, "Using bot");

        await message.reply(
          `_User @${userId.split("@")[0]} warned._ \n_Warn Count: ${warnInfo.warnCount}._ \n_Reason: Using bot_`,
          { mentions: [userId] },
        );

        if (warnInfo.warnCount > WARN_NO) {
          await resetWarn(userId);
          await message.sendMessage(
            message.jid,
            "Warn limit exceeded, kicking user",
          );
          return await message.client.groupParticipantsUpdate(
            message.jid,
            userId,
            "remove",
          );
        } else {
          await message.client.sendMessage(message.jid, {
            delete: message.key,
          });
        }
      } else if (action === "kick") {
        return await message.client.groupParticipantsUpdate(
          message.jid,
          userId,
          "remove",
        );
      } else {
        await message.client.sendMessage(message.jid, { delete: message.key });
      }
    }

    if (
      settings.antilink &&
      settings.antilink.status === "true" &&
      containsLink(message)
    ) {
      const action = settings.antilink.action;
      const warnInfo = (await getWarns(userId)) || {
        warnCount: 0,
        reasons: [],
      };

      if (action === "warn") {
        warnInfo.warnCount += 1;
        warnInfo.reasons.push("Sent a link");
        await saveWarn(userId, "Sent a link");

        await message.reply(
          `_User @${userId.split("@")[0]} warned._ \n_Warn Count: ${warnInfo.warnCount}._ \n_Reason: Sent a link_`,
          { mentions: [userId] },
        );

        if (warnInfo.warnCount > WARN_NO) {
          await resetWarn(userId);
          await message.sendMessage(
            message.jid,
            "Warn limit exceeded, kicking user",
          );
          return await message.client.groupParticipantsUpdate(
            message.jid,
            userId,
            "remove",
          );
        } else {
          await message.client.sendMessage(message.jid, {
            delete: message.key,
          });
        }
      } else if (action === "kick") {
        return await message.client.groupParticipantsUpdate(
          message.jid,
          userId,
          "remove",
        );
      } else {
        await message.client.sendMessage(message.jid, { delete: message.key });
      }
    }

    const bannedWords =
      settings.antiword && settings.antiword.word
        ? JSON.parse(settings.antiword.word)
        : [];
    if (bannedWords.length > 0 && containsBannedWord(message, bannedWords)) {
      const action = settings.antiword.action;
      const warnInfo = (await getWarns(userId)) || {
        warnCount: 0,
        reasons: [],
      };

      if (action === "warn") {
        warnInfo.warnCount += 1;
        warnInfo.reasons.push("Used a banned word");
        await saveWarn(userId, "Used a banned word");

        await message.reply(
          `_User @${userId.split("@")[0]} warned._ \n_Warn Count: ${warnInfo.warnCount}._ \n_Reason: Used a banned word_`,
          { mentions: [userId] },
        );

        if (warnInfo.warnCount > WARN_NO) {
          await resetWarn(userId);
          await message.sendMessage(
            message.jid,
            "Warn limit exceeded, kicking user",
          );
          return await message.client.groupParticipantsUpdate(
            message.jid,
            userId,
            "remove",
          );
        } else {
          await message.client.sendMessage(message.jid, {
            delete: message.key,
          });
        }
      } else if (action === "kick") {
        return await message.client.groupParticipantsUpdate(
          message.jid,
          userId,
          "remove",
        );
      } else {
        await message.client.sendMessage(message.jid, { delete: message.key });
      }
    }
  },
);
