const cron = require("node-cron");
const ScheduleDB = require("../lib/database/schedule");
const { alpha, isAdmin, config } = require("../lib");

const scheduleModule = {
  scheduleCron: async (timeString, jobFunction) => {
    let [hours, minutes] = timeString.split(":");
    let cronJob = cron.schedule(`${minutes} ${hours} * * *`, jobFunction, {
      scheduled: false,
      timezone: config.TZ,
    });
    cronJob.start();
    return cronJob;
  },

  saveSchedule: async (chatId, timeString, jobFunction) => {
    await ScheduleDB.create({
      chatId,
      time: timeString,
      jobFunction: JSON.stringify(jobFunction),
    });
  },

  getSchedule: async (chatId) => {
    return await ScheduleDB.findAll({
      where: { chatId },
    });
  },

  startSchedule: async (chatId = "all") => {
    const schedulesToStart =
      chatId === "all"
        ? await ScheduleDB.findAll()
        : await ScheduleDB.findAll({ where: { chatId } });

    for (let schedule of schedulesToStart) {
      scheduleModule.scheduleCron(
        schedule.time,
        JSON.parse(schedule.jobFunction),
      );
    }
  },
};

alpha(
  {
    pattern: "amute",
    fromMe: true,
    desc: "auto mute group at a specific time",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    let time = match;
    if (!time)
      return await message.reply("_Please specify a time in HH:MM format_");
    await scheduleModule.saveSchedule(message.jid, time, async () => {
      await client.groupSettingUpdate(message.jid, "announcement");
    });
    await scheduleModule.startSchedule(message.jid);
    return await message.reply(`_Scheduled to mute the group at ${time}_`);
  },
);

alpha(
  {
    pattern: "aunmute",
    fromMe: true,
    desc: "auto unmute group at a specific time",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    let time = match;
    if (!time)
      return await message.reply("_Please specify a time in HH:MM format_");
    await scheduleModule.saveSchedule(message.jid, time, async () => {
      await client.groupSettingUpdate(message.jid, "not_announcement");
    });
    await scheduleModule.startSchedule(message.jid);
    return await message.reply(`_Scheduled to unmute the group at ${time}_`);
  },
);
