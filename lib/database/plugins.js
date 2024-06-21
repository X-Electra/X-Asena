const axios = require("axios");
const config = require("../../config");
const { DataTypes } = require("sequelize");
const fs = require("fs/promises");
const path = require("path");

const PluginDB = config.DATABASE.define("Plugin", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

async function installPlugin(adres, file) {
  const existingPlugin = await PluginDB.findOne({ where: { url: adres } });
  if (existingPlugin) {
    return false;
  } else {
    return await PluginDB.create({ url: adres, name: file });
  }
}

async function removePlugin(name) {
  const existingPlugin = await PluginDB.findOne({ where: { name: name } });

  if (existingPlugin) {
    await existingPlugin.destroy();
    return true;
  } else {
    return false;
  }
}

async function reqextplugins() {
  let plugins = await PluginDB.findAll();
  plugins = plugins.map((plugin) => plugin.dataValues);

  for (const plugin of plugins) {
    const pluginPath = path.join(__basedir, "plugins", `${plugin.name}.js`);
    try {
      let url = plugin.url.endsWith("/raw") ? plugin.url : `${plugin.url}/raw`;
      const { data } = await axios.get(url);
      await fs.writeFile(pluginPath, data);
      require(pluginPath);
      console.log("Installed plugin:", plugin.name);
    } catch (e) {
      console.error(`Failed to install plugin ${plugin.name}:`, e);
      await PluginDB.destroy({ where: { id: plugin.id } });
      try {
        await fs.unlink(pluginPath);
        console.log(`Deleted file for plugin ${plugin.name} due to error.`);
      } catch (unlinkError) {
        console.error(
          `Failed to delete file for plugin ${plugin.name}:`,
          unlinkError,
        );
      }
    }
  }
}

async function extplugins() {
  const count = await PluginDB.count();
  return count || 0;
}

module.exports = {
  PluginDB,
  installPlugin,
  removePlugin,
  reqextplugins,
  extplugins,
};
