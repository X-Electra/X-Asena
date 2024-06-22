const cron = require("node-cron");
const ScheduleDB = require("../lib/database/schedule");
const { alpha, isAdmin, config } = require("../lib");

const jobFunctions = {
  muteGroup: async (message, jid) => {
    try {
      console.log(`muting group ${jid}`);
      await message.client.groupSettingUpdate(jid, "announcement");
    } catch (error) {
      console.error(`Error muting group ${jid}:`, error);
    }
  },
  unmuteGroup: async (message, jid) => {
    try {
      console.log(`Unmuting group ${jid}`);
      await message.client.groupSettingUpdate(jid, "not_announcement");
    } catch (error) {
      console.error(`Error unmuting group ${jid}:`, error);
    }
  },
};

const scheduleModule = {
  scheduleCron: async (timeString, jobFunction) => {
    try {
      let [hours, minutes] = timeString.split(":");
      let cronJob = cron.schedule(`${minutes} ${hours} * * *`, jobFunction, {
        scheduled: false,
        timezone: config.TZ,
      });
      cronJob.start();
      console.log(`Scheduled job for ${timeString}`);
      return cronJob;
    } catch (error) {
      console.error("Error scheduling cron job:", error);
    }
  },

  saveSchedule: async (chatId, timeString, jobFunctionName) => {
    try {
      await ScheduleDB.create({
        chatId,
        time: timeString,
        jobFunction: jobFunctionName,
      });
      console.log(`Saved schedule for chatId: ${chatId}, time: ${timeString}`);
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  },

  getSchedule: async (chatId) => {
    try {
      return await ScheduleDB.findAll({
        where: { chatId },
      });
    } catch (error) {
      console.error("Error getting schedule:", error);
    }
  },

  startSchedule: async (message, chatId = "all") => {
    try {
      const schedulesToStart =
        chatId === "all"
          ? await ScheduleDB.findAll()
          : await ScheduleDB.findAll({ where: { chatId } });

      for (let schedule of schedulesToStart) {
        const jobFunction = jobFunctions[schedule.jobFunction];
        if (jobFunction) {
          await scheduleModule.scheduleCron(schedule.time, async () =>
            jobFunction(message, schedule.chatId),
          );
        }
      }
      console.log(`Started schedules for chatId: ${chatId}`);
    } catch (error) {
      console.error("Error starting schedules:", error);
    }
  },
};

// Command handlers
alpha(
  {
    pattern: "amute",
    fromMe: true,
    desc: "auto mute group at a specific time",
    type: "group",
  },
  async (message, match, m, client) => {
    try {
      if (!message.isGroup)
        return await message.reply("_This command is for groups_");
      if (!(await isAdmin(message.jid, message.user, message.client)))
        return await message.reply("_I'm not admin_");
      let time = match;
      if (!time)
        return await message.reply("_Please specify a time in HH:MM format_");
      await scheduleModule.saveSchedule(message.jid, time, "muteGroup");
      await scheduleModule.startSchedule(message, message.jid);
      return await message.reply(`_Scheduled to mute the group at ${time}_`);
    } catch (error) {
      console.error("Error in amute command:", error);
    }
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
    try {
      if (!message.isGroup)
        return await message.reply("_This command is for groups_");
      if (!(await isAdmin(message.jid, message.user, message.client)))
        return await message.reply("_I'm not admin_");
      let time = match;
      if (!time)
        return await message.reply("_Please specify a time in HH:MM format_");
      await scheduleModule.saveSchedule(message.jid, time, "unmuteGroup");
      await scheduleModule.startSchedule(message, message.jid);
      return await message.reply(`_Scheduled to unmute the group at ${time}_`);
    } catch (error) {
      console.error("Error in aunmute command:", error);
    }
  },
);
