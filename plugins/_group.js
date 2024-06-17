const { alpha, isPrivate } = require("../lib");
const { isAdmin, parsedJid } = require("../lib");
const { groupDB }= require("../lib/database/group")

alpha(
  {
    pattern: "add",
    fromMe: true,
    desc: "add a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is only for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");
    const isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);
    await message.client.groupParticipantsUpdate(message.jid, jid, "add");
    return await message.reply(`_@${jid[0].split("@")[0]} added_`, {
      mentions: [jid],
    });
  },
);

alpha(
  {
    pattern: "kick",
    fromMe: true,
    desc: "kicks a person from group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to kick_");
    const isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);
    await message.client.groupParticipantsUpdate(message.jid, jid, "remove");
    return await message.reply(`_@${jid[0].split("@")[0]} kicked_`, {
      mentions: [jid],
    });
  },
);
alpha(
  {
    pattern: "promote",
    fromMe: true,
    desc: "promote to admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to promote_");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "promote");

    return await message.reply(`_@${jid[0].split("@")[0]} promoted as admin_`, {
      mentions: [jid],
    });
  },
);
alpha(
  {
    pattern: "demote",
    fromMe: true,
    desc: "demote from admin",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");

    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to demote_");

    const isadmin = await isAdmin(message.jid, message.user, message.client);

    if (!isadmin) return await message.reply("_I'm not admin_");
    const jid = parsedJid(match);

    await message.client.groupParticipantsUpdate(message.jid, jid, "demote");

    return await message.reply(
      `_@${jid[0].split("@")[0]} demoted from admin_`,
      {
        mentions: [jid],
      },
    );
  },
);

alpha(
  {
    pattern: "mute",
    fromMe: true,
    desc: "mute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    await message.reply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  },
);

alpha(
  {
    pattern: "unmute",
    fromMe: true,
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  },
);

alpha(
  {
    pattern: "gjid",
    fromMe: true,
    desc: "gets jid of all group members",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "╭──〔 *Group Jids* 〕\n";
    participant.forEach((result) => {
      str += `├ *${result}*\n`;
    });
    str += `╰──────────────`;
    message.reply(str);
  },
);

alpha(
  {
    pattern: "tag",
    fromMe: true,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    if (match === "all") {
      let teks = "";
      for (let mem of participants) {
        teks += `@${mem.id.split("@")[0]}\n`;
      }
      message.sendMessage(message.jid, teks.trim(), {
        mentions: participants.map((a) => a.id),
      });
    } else {
      match = match || message.reply_message.text;
      if (!match) return message.reply("_Enter or reply to a text to tag_");
      message.sendMessage(message.jid, match, {
        mentions: participants.map((a) => a.id),
      });
    }
  },
);

alpha(
  {
    pattern: "pdm",
    fromMe: true,
    desc: "promote, demote messages",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
  if (!match) return message.reply('pdm on/off');
  if (match != 'on' && match != 'off') return message.reply('pdm on');
  const {pdm} = await groupDB(['pdm'], {jid: message.jid, content: {}}, 'get');
  if (match == 'on') {
      if (pdm == 'true') return message.reply('_Already activated_');
      await groupDB(['pdm'], {jid: message.jid, content: 'true'}, 'set');
      return await message.reply('_activated_')
  } else if (match == 'off') {
      if (pdm == 'false') return message.reply('_Already Deactivated_');
      await groupDB(['pdm'], {jid: message.jid, content: 'false'}, 'set');
      return await message.reply('_deactivated_')
  }
});

alpha(
  {
    pattern: "antidemote",
    fromMe: true,
    desc: "demote actor and re-promote demoted person",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
  if (!match) return message.reply('antidemote on/off');
  if (match != 'on' && match != 'off') return message.reply('antidemote on\n\n*note antidemote only works if pdm is on*');
  const {antidemote} = await groupDB(['antidemote'], {jid: message.jid, content: {}}, 'get');
  if (match == 'on') {
      if (antidemote == 'true') return message.reply('_Already activated_');
      await groupDB(['antidemote'], {jid: message.jid, content: 'true'}, 'set');
      return await message.reply('_activated_')
  } else if (match == 'off') {
      if (antidemote == 'false') return message.reply('_Already Deactivated_');
      await groupDB(['antidemote'], {jid: message.jid, content: 'false'}, 'set');
      return await message.reply('_deactivated_')
  }
});

alpha(
  {
    pattern: "antipromote",
    fromMe: true,
    desc: "demote actor and re-promote demoted person",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
  if (!match) return message.reply('antipromote on/off');
  if (match != 'on' && match != 'off') return message.reply('antipromote on\n\n*note antipromote only works if pdm is on*');
  const {antipromote} = await groupDB(['antipromote'], {jid: message.jid, content: {}}, 'get');
  if (match == 'on') {
      if (antipromote == 'true') return message.reply('_Already activated_');
      await groupDB(['antipromote'], {jid: message.jid, content: 'true'}, 'set');
      return await message.reply('_activated_')
  } else if (match == 'off') {
      if (antipromote == 'false') return message.reply('_Already Deactivated_');
      await groupDB(['antipromote'], {jid: message.jid, content: 'false'}, 'set');
      return await message.reply('_deactivated_')
  }
});


alpha(
  {
    pattern: "antibot",
    fromMe: true,
    desc: "remove users who use bot",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
    if (!match)
      return await message.reply("_*antibot* on/off_\n_*antibot* action warn/kick/null_",);
    const { antibot } = await groupDB(["antibot"],{ jid: message.jid, content: {} },"get",);
    if (match.toLowerCase() == "on") {
      const action = antibot && antibot.action ? antibot.action : "null";
      await groupDB(["antibot"],{ jid: message.jid, content: { status: "true", action } },"set",);
      return await message.reply(`_antibot Activated with action null_\n_*antibot action* warn/kick/null for chaning actions_`,);
    } else if (match.toLowerCase() == "off") {
      const action = antibot && antibot.action ? antibot.action : "null";
      await groupDB(["antibot"],{ jid: message.jid, content: { status: "false", action } },"set",);
      return await message.reply(`_antibot deactivated_`);
    } else if (match.toLowerCase().match("action")) {
      const status = antibot && antibot.status ? antibot.status : "false";
      match = match.replace(/action/gi, "").trim();
      if (!actions.includes(match))
        return await message.reply("_action must be warn,kick or null_");
      await groupDB(["antibot"],{ jid: message.jid, content: { status, action: match } },"set",);
      return await message.reply(`_AntiBot Action Updated_`);
    }
  },
);


alpha(
  {
    pattern: "antifake",
    fromMe: true,
    desc: "remove fake numbers",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
  if (!match) return await message.reply('_*antifake* 94,92_\n_*antifake* on/off_\n_*antifake* list_');
  const {antifake} = await groupDB(['antifake'], {jid: message.jid, content: {}}, 'get');
  if(match.toLowerCase()=='get'){
  if(!antifake || antifake.status == 'false' || !antifake.data) return await message.reply('_Not Found_');
  return await message.reply(`_*activated restricted numbers*: ${antifake.data}_`);
  } else if(match.toLowerCase() == 'on') {
    const data = antifake && antifake.data ? antifake.data : '';
    await groupDB(['antifake'], {jid: message.jid, content: {status: 'true', data}}, 'set');
      return await message.reply(`_Antifake Activated_`)
  } else if(match.toLowerCase() == 'off') {
      const data = antifake && antifake.data ? antifake.data : '';
    await groupDB(['antifake'], {jid: message.jid, content: {status: 'false', data}}, 'set');
  return await message.reply(`_Antifake Deactivated_`)
  }
  match = match.replace(/[^0-9,!]/g, '');
  if(!match) return await message.reply('value must be number');
  const status = antifake && antifake.status ? antifake.status : 'false';
  await groupDB(['antifake'], {jid: message.jid, content: {status, data: match}}, 'set');
  return await message.reply(`_Antifake Updated_`);
});


alpha(
  {
    pattern: "antilink",
    fromMe: true,
    desc: "remove users who send links",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
  if (!match) return await message.reply("_*antilink* on/off_\n_*antilink* action warn/kick/null_");
  const {antilink} = await groupDB(['antilink'], {jid: message.jid, content: {}}, 'get');
  if(match.toLowerCase() == 'on') {
    const action = antilink && antilink.action ? antilink.action : 'null';
      await groupDB(['antilink'], {jid: message.jid, content: {status: 'true', action }}, 'set');
      return await message.reply(`_antilink Activated with action null_\n_*antilink action* warn/kick/null for chaning actions_`)
  } else if(match.toLowerCase() == 'off') {
    const action = antilink && antilink.action ? antilink.action : 'null';
      await groupDB(['antilink'], {jid: message.jid, content: {status: 'false', action }}, 'set')
      return await message.reply(`_antilink deactivated_`)
  } else if(match.toLowerCase().match('action')) {
    const status = antilink && antilink.status ? antilink.status : 'false';
      match = match.replace(/action/gi,'').trim();
      if(!actions.includes(match)) return await message.reply('_action must be warn,kick or null_')
      await groupDB(['antilink'], {jid: message.jid, content: {status, action: match }}, 'set')
      return await message.reply(`_AntiLink Action Updated_`);
  }
});

alpha(
  {
    pattern: "antiword",
    fromMe: true,
    desc: "remove users who use restricted words",
    type: "group",
  },
  async (message, match) => {
  if (!message.isGroup) return;
  if (!match) return await message.reply("_*antiword* on/off_\n_*antiword* action warn/kick/null_");
  const {antiword} = await groupDB(['antiword'], {jid: message.jid, content: {}}, 'get');
  if(match.toLowerCase() == 'get') {
    const status = antiword && antiword.status == 'true' ? true : false
      if(!status  || !antiword.word) return await message.reply('_Not Found_');
      return await message.reply(`_*activated antiwords*: ${antiword.word}_`);
  } else if(match.toLowerCase() == 'on') {
    const action = antiword && antiword.action ? antiword.action : 'null';
      const word = antiword && antiword.word ? antiword.word : undefined;
      await groupDB(['antiword'], {jid: message.jid, content: {status: 'true', action, word}}, 'set');
      return await message.reply(`_antiword Activated with action null_\n_*antiword action* warn/kick/null for chaning actions_`)
  } else if(match.toLowerCase() == 'off') {
    const action = antiword && antiword.action ? antiword.action : 'null';
      const word = antiword && antiword.word ? antiword.word : undefined;
      await groupDB(['antiword'], {jid: message.jid, content: {status: 'false', action,word }}, 'set')
      return await message.reply(`_antiword deactivated_`)
  } else if(match.toLowerCase().match('action')) {
    const status = antiword && antiword.status ? antiword.status : 'false';
      match = match.replace(/action/gi,'').trim();
      if(!actions.includes(match)) return await message.reply('_action must be warn,kick or null_')
      await groupDB(['antiword'], {jid: message.jid, content: {status, action: match }}, 'set')
      return await message.reply(`_antiword Action Updated_`);
  } else {
    if(!match) return await message.reply('_*Example:* antiword 🏳️‍🌈, gay, nigga_');
    const status = antiword && antiword.status ? antiword.status : 'false';
      const action = antiword && antiword.action ? antiword.action : 'null';
      await groupDB(['antiword'], {jid: message.jid, content: {status, action,word: match}}, 'set')
      return await message.reply(`_Antiwords Updated_`);
  }
});