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

async function getandRequirePlugins() {
  let plugins = await PluginDB.findAll();
  plugins = plugins.map((plugin) => plugin.dataValues);

  for (const plugin of plugins) {
    try {
      const { data } = await axios.get(`${plugin.url}/raw`);
      const pluginPath = path.join(__basedir, "plugins", `${plugin.name}.js`);
      await fs.writeFile(pluginPath, data);
      require(pluginPath);
      console.log("Installed plugin:", plugin.name);
    } catch (e) {
      console.error(`Failed to install plugin ${plugin.name}:`, e);
      await PluginDB.destroy({ where: { id: plugin.id } });
      console.log(`Deleted plugin ${plugin.name} from database due to error.`);
    }
  }
}

module.exports = {
  PluginDB,
  installPlugin,
  removePlugin,
  getandRequirePlugins,
};
