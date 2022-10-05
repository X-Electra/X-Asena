/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/
var cron = require("node-cron");
const { db } = require(".");
module.exports = {
  cron: async (time, func) => {
    let [hr, min] = time.split(":");
    let task = cron.schedule(
      `${min} ${hr} * * *`,
      () => {
        func();
      },
      {
        scheduled: false,
        timezone: "Asia/Kolkata",
      }
    );
    return task.start();
  },
  saveSchedule: async (chat, time, func) => {
    let crondb = (db.data.cron = []);
    crondb.push({
      time,
      func:JSON.stringify(func),
      chat,
    });
    await db.write();
  },
  getSchedule: async (jid) => {
    if (db.data.cron !== []) {
      return db.data.cron.filter((a) => {
        a.chat == jid;
      });
    } else {
      return [];
    }
  },
  startSchedule: async (chat = "all") => {
    if (chat == "all") {
      for (let i of db.data.cron) {
        this.cron(i.time, i.func);
      }
    } else {
      let Db = db.data.cron.filter((sch) => {
        sch.chat == chat;
      });
      for (let i of Db) {
        this.cron(i.time, i.func);
      }
    }
  },
};
