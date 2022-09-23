const {command, isPrivate } = require("../lib/");
const { getmsg } = require("../lib/message");
command(
  {
    pattern: "getmsg ?(.*)",
    fromMe: isPrivate,
    desc: "description",
    type: "type",
  },
  async (message, match) => {
    let msg = getmsg(message.jid)
    let str = `Total Messages in this chat : ${msg.total_msg}`
    for (let i of msg.user()){
        console.log(message.users[i])
    }
  }
);
