const config = require("../config");
const { parseJid } = require("./");
async function Greetings(data,conn){let metadata = await conn.groupMetadata(data.id)
for(let user of data.participants){
  let userpp 
  try{
    userpp = await conn.profilePictureUrl(user, 'image')
  }catch{
    userpp = 'https://getwallpapers.com/wallpaper/full/3/5/b/530467.jpg'
  }
switch (data.action) {
  case "add":
    {
let welcome_message = config.WELCOME_MSG
let msg = welcome_message.replace(/@user/gi,'@'+user.split('@')[0]).replace(/@gname/gi,metadata.subject).replace(/@count/gi,metadata.participants.length)
if(/{pp}/.test(msg)){
conn.sendMessage(data.id,{image:{url:userpp},caption:msg.replace(/{pp}/,''),mentions:parseJid(msg)})
}else{
conn.sendMessage(data.id,{text:msg,mentions:parseJid(msg)})
}
    }
    break;
  case "remove":
    {
      let GOODBYE_MSG = config.GOODBYE_MSG
let msg = GOODBYE_MSG.replace(/@user/gi,'@'+user.split('@')[0]).replace(/@gname/gi,metadata.subject).replace(/@count/gi,metadata.participants.length)
if(/{pp}/.test(msg)){
conn.sendMessage(data.id,{image:{url:userpp},caption:msg.replace(/{pp}/,''),mentions:parseJid(msg)})
}else{
conn.sendMessage(data.id,{text:msg,mentions:parseJid(msg)})
}
    }
    break;
}}
}
module.exports = Greetings