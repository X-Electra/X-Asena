var cron = require("node-cron");
module.exports = {
  cron: async (time, func ) => {
    let [hr,min] = time.split(':')
    let task = cron.schedule(
      `${min} ${hr} * * *`,
      () => {
       func()
      },
      {
        scheduled: false,
        timezone: "Asia/Kolkata",
      }
    );
    return  task.start()
  },
};
