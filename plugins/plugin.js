<<<<<<< HEAD
const { command, getUrl } = require("../lib");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");

command(
  {
    pattern: "install ?(.*)",
    fromMe: true,
    desc: "Installs External plugins",
  },
  async (message, match) => {
    if (!match)
      return await message.sendMessage(
        "send a plugin url"
      );
     
    try {
      var url = new URL(Url);
    } catch {
      return await message.sendMessage("_Invalid Url_");
=======
const { command,getJson } = require("../lib/");
const { installPlugin } = require("../lib/database/plugins");

command(
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
>>>>>>> xasena/master
    }

    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }
<<<<<<< HEAD
    var plugin_name;
    var response = await got(url);
    if (response.statusCode == 200) {
      var commands = response.body
        .match(/(?<=pattern:)(.*)(?=\?(.*))/g)
        .map((a) => a.trim().replace(/"|'|`/, ""));
      plugin_name = commands[0] || plugin_name[1] ||"__" + Math.random().toString(36).substring(8);
      

      fs.writeFileSync("./plugins/" + plugin_name + ".js", response.body);
      try {
        require("./" + plugin_name);
      } catch (e) {
        fs.unlinkSync("/xasena/plugins/" + plugin_name + ".js");
        return await message.sendMessage("Invalid Plugin\n ```" + e + "```");
      }

      await installPlugin(url, plugin_name);

      await message.sendMessage(
        `_New plugin installed : ${commands.join(",")}_`
      );
    }
  }
  
);

command(
  { pattern: "plugin", fromMe: true, desc: 'plugin list' },
  async (message, match) => {
    var mesaj = "";
    var plugins = await PluginDB.findAll();
    if (plugins.length < 1) {
      return await message.sendMessage("No external plugins installed");
    } else {
      plugins.map((plugin) => {
        mesaj +=
          "```" +
          plugin.dataValues.name +
          "```: " +
          plugin.dataValues.url +
          "\n";
      });
      return await message.sendMessage(mesaj);
    }
  }
);

command(
  { pattern: "remove(?: |$)(.*)", fromMe: true, desc: 'Remove external plugins' },
  async (message, match) => {
    if (!match) return await message.sendMessage('need a plugin name');
    if (!match.startsWith("__")) match = "__" + match;
    var plugin = await PluginDB.findAll({ where: { name: match } });
    if (plugin.length < 1) {
      return await message.sendMessage("_Plugin not found_");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync("./plugins/" + match + ".js");
      await message.sendMessage(`Plugin ${match} deleted`);
    }
  }
);
=======
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
>>>>>>> xasena/master
