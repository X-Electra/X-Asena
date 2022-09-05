const { bot,getJson } = require("../lib/");
const { installPlugin } = require("../lib/database/plugins");

bot(
  {
    pattern: "plugin ?(.*)",
    fromMe: true,
    desc: "install a new plugin",
    type: "misc",
  },
  async (message, match) => {
    try {
      var url = new URL(match);
    } catch(err){
      console.log(err)
      return await message.reply("Invalid URL");
    }

    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }
    let data = await getJson(url);
    //console.log(data)
    var plugin_name = data.match(/pattern: ["'](.*)["']/gimud)[0]
    console.log(plugin_name.split()[0])
    if (plugin_name.length >= 1) {
        plugin_name = "__" + plugin_name[1];
    } else {
        plugin_name = "__" + Math.random().toString(36).substring(8);
    }
    writeFileSync('./plugins/' + plugin_name + '.js', data);
    try {
      require('./' + plugin_name)
  } catch (e) {
      fs.unlinkSync('./plugins/' + plugin_name + '.js')
      return await message.sendMessage('Invalid Plugin\n' + ' ```' + e + '```');
  }finally{
await installPlugin(url,plugin_name)
  }
    message.reply(`Success Fully Installed Plugin ${plugin_name}`);
  }
);

{

  }
