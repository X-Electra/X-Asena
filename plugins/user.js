const { alpha, isAdmin, parsedJid, isPrivate } = require("../lib");
const { WA_DEFAULT_EPHEMERAL } = require("baileys");
const { exec } = require("child_process");
const { PausedChats, WarnDB } = require("../lib/database");
const { WARN_COUNT } = require("../config");
const { saveWarn, resetWarn } = WarnDB;

alpha(
  {
    pattern: "pause",
    fromMe: true,
    desc: "Pause the chat",
    dontAddCommandList: true,
  },
  async (message) => {
    const chatId = message.key.remoteJid;
    try {
      await PausedChats.savePausedChat(chatId);
      message.reply("Chat paused successfully.");
    } catch (error) {
      console.error(error);
      message.reply("Error pausing the chat.");
    }
  },
);

alpha(
  {
    pattern: "shutdown",
    fromMe: true,
    desc: "stops the bot",
    type: "user",
  },
  async (message, match) => {
    await message.sendMessage(message.jid, "shutting down...");
    exec("pm2 stop x-asena", (error, stdout, stderr) => {
      if (error) {
        return message.sendMessage(message.jid, `Error: ${error}`);
      }
      return;
    });
  },
);

alpha(
  {
    pattern: "resume",
    fromMe: true,
    desc: "Resume the paused chat",
    dontAddCommandList: true,
  },
  async (message) => {
    const chatId = message.key.remoteJid;

    try {
      const pausedChat = await PausedChats.PausedChats.findOne({
        where: { chatId },
      });

      if (pausedChat) {
        await pausedChat.destroy();
        message.reply("Chat resumed successfully.");
      } else {
        message.reply("Chat is not paused.");
      }
    } catch (error) {
      console.error(error);
      message.reply("Error resuming the chat.");
    }
  },
);

alpha(
  {
    pattern: "setpp",
    fromMe: true,
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let buff = await m.quoted.download();
    await message.setPP(message.user, buff);
    return await message.reply("_Profile Picture Updated_");
  },
);

alpha(
  {
    pattern: "setname",
    fromMe: true,
    desc: "Set User name",
    type: "user",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter name_");
    await message.updateName(match);
    return await message.reply(`_Username Updated : ${match}_`);
  },
);

alpha(
  {
    pattern: "block",
    fromMe: true,
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessage(`_@${jid.split("@")[0]} Blocked_`, {
        mentions: [jid],
      });
    } else {
      await message.block(message.jid);
      return await message.reply("_User blocked_");
    }
  },
);

alpha(
  {
    pattern: "unblock",
    fromMe: true,
    desc: "Unblock a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessage(
        message.jid,
        `_@${jid.split("@")[0]} unblocked_`,
        {
          mentions: [jid],
        },
      );
    } else {
      await message.unblock(message.jid);
      return await message.reply("_User unblocked_");
    }
  },
);

alpha(
  {
    pattern: "jid",
    fromMe: true,
    desc: "Give jid of chat/user",
    type: "user",
  },
  async (message, match) => {
    return await message.sendMessage(
      message.jid,
      message.mention[0] || message.reply_message.jid || message.jid,
    );
  },
);

alpha(
  {
    pattern: "dlt",
    fromMe: true,
    desc: "deletes a message",
    type: "user",
  },
  async (message, match, m, client) => {
    if (message.isGroup) {
      client.sendMessage(message.jid, { delete: message.reply_message.key });
    }
  },
);

alpha(
  {
    pattern: "warn",
    fromMe: true,
    desc: "Warn a user",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return message.reply("_Mention or reply to someone_");
    let reason = message?.reply_message.text || match;
    reason = reason.replace(/@(\d+)/, "");
    reason = reason ? reason.length <= 1 : "Reason not Provided";

    const warnInfo = await saveWarn(userId, reason);
    let userWarnCount = warnInfo ? warnInfo.warnCount : 0;
    userWarnCount++;
    await message.reply(
      `_User @${
        userId.split("@")[0]
      } warned._ \n_Warn Count: ${userWarnCount}._ \n_Reason: ${reason}_`,
      { mentions: [userId] },
    );
    if (userWarnCount > WARN_COUNT) {
      const jid = parsedJid(userId);
      await message.sendMessage(
        message.jid,
        "Warn limit exceeded kicking user",
      );
      return await message.client.groupParticipantsUpdate(
        message.jid,
        jid,
        "remove",
      );
    }
    return;
  },
);

alpha(
  {
    pattern: "resetwarn",
    fromMe: true,
    desc: "Reset warnings for a user",
  },
  async (message) => {
    if (!message.isGroup) return;
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return message.reply("_Mention or reply to someone_");
    await resetWarn(userId);
    return await message.reply(
      `_Warnings for @${userId.split("@")[0]} reset_`,
      {
        mentions: [userId],
      },
    );
  },
);

alpha({
	pattern: 'pinchat',
	fromMe: true,
	desc: 'pin a chat',
	type: 'whatsapp'
}, async (message, match) => {
	await message.client.chatModify({
		pin: true
	}, message.jid);
	await message.reply('_Pined_')
})

alpha({
	pattern: 'unpin',
	fromMe: true,
	desc: 'unpin a msg',
	type: 'whatsapp'
}, async (message, match) => {
	await message.client.chatModify({
		pin: false
	}, message.jid);
	await message.reply('_Unpined_')
})

alpha({
	pattern: 'setbio',
	fromMe: true,
	desc: 'To change your profile status',
	type: 'whatsapp'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.reply('*Need Status!*\n*Example: setbio Hey there! I am using WhatsApp*.')
	await message.client.updateProfileStatus(match)
	await message.reply('_Profile status updated_')
})

alpha({
	pattern: 'setname',
	fromMe: true,
	desc: 'To change your profile name',
	type: 'whatsapp'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.reply('*Need Name!*\n*Example: setname your name*.')
	await message.client.updateProfileName(match)
	await message.reply('_Profile name updated_')
})

alpha({
	pattern: 'disappear',
	fromMe: true,
	desc: 'turn on default disappear messages',
	type: 'whatsapp'
}, async (message, match) => {
  if(match === 'off'){
    await message.client.sendMessage(
      message.jid, 
      { disappearingMessagesInChat: false } )
      await message.reply('_disappearmessage deactivated_') 
} else {
  await message.client.sendMessage(
		message.jid, {
			disappearingMessagesInChat: WA_DEFAULT_EPHEMERAL
		}
	)
	await message.reply('_disappearmessage activated_')}
})

alpha({
	pattern: 'lastseen',
	fromMe: true,
	desc: 'to change lastseen privacy',
	type: 'whatsapp'
}, async (message, match, cmd) => {
	if (!match) return await message.reply(`_*Example:-* ${cmd} all_\n_to change last seen privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.reply(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateLastSeenPrivacy(match)
	await message.reply(`_Privacy settings *last seen* Updated to *${match}*_`);
})

alpha({
	pattern: 'online',
	fromMe: true,
	desc: 'to change online privacy',
	type: 'whatsapp'
}, async (message, match, cmd) => {
	if (!match) return await message.reply(`_*Example:-* ${cmd} all_\n_to change *online*  privacy settings_`);
	const available_privacy = ['all', 'match_last_seen'];
	if (!available_privacy.includes(match)) return await message.reply(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateOnlinePrivacy(match)
	await message.reply(`_Privacy Updated to *${match}*_`);
})

alpha({
	pattern: 'mypp',
	fromMe: true,
	desc: 'privacy setting profile picture',
	type: 'whatsapp'
}, async (message, match, cmd) => {
	if (!match) return await message.reply(`_*Example:-* ${cmd} all_\n_to change *profile picture*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.reply(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateProfilePicturePrivacy(match)
	await message.reply(`_Privacy Updated to *${match}*_`);
})

alpha({
	pattern: 'mystatus',
	fromMe: true,
	desc: 'privacy for my status',
	type: 'whatsapp'
}, async (message, match, cmd) => {
	if (!match) return await message.reply(`_*Example:-* ${cmd} all_\n_to change *status*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.reply(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateStatusPrivacy(match)
	await message.reply(`_Privacy Updated to *${match}*_`);
})

alpha({
	pattern: 'read',
	fromMe: true,
	desc: 'privacy for read message',
	type: 'whatsapp'
}, async (message, match, cmd) => {
	if (!match) return await message.reply(`_*Example:-* ${cmd} all_\n_to change *read and receipts message*  privacy settings_`);
	const available_privacy = ['all', 'none'];
	if (!available_privacy.includes(match)) return await message.reply(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateReadReceiptsPrivacy(match)
	await message.reply(`_Privacy Updated to *${match}*_`);
})

alpha({
	pattern: 'groupadd',
	fromMe: true,
	desc: 'privacy for group add',
	type: 'whatsapp'
}, async (message, match, cmd) => {
	if (!match) return await message.reply(`_*Example:-* ${cmd} all_\n_to change *group add*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.reply(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateGroupsAddPrivacy(match)
	await message.reply(`_Privacy Updated to *${match}*_`);
});
