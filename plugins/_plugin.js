const { command, getUrl } = require("../lib");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "install",
    fromMe: true,
    desc: "Installs External plugins",
    type:'user'
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("_Send a plugin url_");
    for (let Url of getUrl(match)) {
      try {
        var url = new URL(Url);
      } catch {
        return await message.sendMessage("_Invalid Url_");
      }

      if (url.host === "gist.github.com") {
        url.host = "gist.githubusercontent.com";
        url = url.toString() + "/raw";
      } else {
        url = url.toString();
      }
      var plugin_name;
      var { body,statusCode } = await got(url);
      if (statusCode == 200) {
        var command = /pattern: ["'](.*)["'],/g.exec(body)     
        var plugin_name
        if(command.split(" ")[1]){
          plugin_name = command.split(" ")[1].replace(/[^A-Z-]/gi,'')
        } else {
          plugin_name = "__" + Math.random().toString(36).substring(8);
        }
        fs.writeFileSync(__dirname+"/" + plugin_name + ".js", response.body);
        try {
          require("./" + plugin_name);
        } catch (e) {
          fs.unlinkSync(__dirname+"/" + plugin_name + ".js");
          return await message.sendMessage("Invalid Plugin\n ```" + e + "```");
        }

        await installPlugin(url, plugin_name);

        await message.sendMessage(
          `_New plugin installed : ${commands.join(",")}_`
        );
      }
    }
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  { pattern: "plugin", fromMe: true, desc: "plugin list" ,type:'user'},
  async (message, match) => {
    var mesaj = "";
    var plugins = await PluginDB.findAll();
    if (plugins.length < 1) {
      return await message.sendMessage("_No external plugins installed_");
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

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

command(
  {
    pattern: "remove(?: |$)(.*)",
    fromMe: true,
    desc: "Remove external plugins",
    type:'user'
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("_Need a plugin name_");

    var plugin = await PluginDB.findAll({ where: { name: match } });

    if (plugin.length < 1) {
      return await message.sendMessage("_Plugin not found_");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync(__dirname+"/" + match + ".js");
      await message.sendMessage(`Plugin ${match} deleted`);
    }
  }
);
