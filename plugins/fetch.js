const { command,isUrl} = require("../lib/");
command(
  {
    pattern: "fetch ?(.*)",
    fromMe: true,
    desc: "fetches from a direct link",
    type: "type",
  },
  async (message, match) => {
    match = match||message.reply_message.text
    if(!match) return message.reply('_Send a direct media link_\n_*link;caption(optional)*_')
    try{
      let url = match.split(';')[0]
      let options = {}
      options.caption = match.split(';')[1]
      
      
if (isUrl(url)){
    message.sendFromUrl(url,options)}else{
        message.reply('_Not a URL_')
    }
  }catch(e){
    console.log(e)
    message.reply('_No content found_')
  }}
);
