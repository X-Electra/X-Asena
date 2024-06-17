const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config");
const methods = ["get", "set", "add", "delete"];
const types = [
  { antibot: "object" },
  { antifake: "object" },
  { antilink: "object" },
  { antiword: "object" },
  { antidemote: "string" },
  { antipromote: "string" },
  { pdm: "string" },
];

function jsonConcat(o1, o2) {
  for (const key in o2) {
    o1[key] = o2[key];
  }
  return o1;
}

const groupDb = config.DATABASE.define("groupDB", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  antibot: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "false",
  },
  antifake: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  antilink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "false",
  },
  antiword: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  antidemote: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "false",
  },
  antipromote: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "false",
  },
  pdm: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "false",
  },
});

async function groupDB(type, options, method) {
  // Ensure type is an array and options.jid is provided
  if (!Array.isArray(type) || !options.jid) return;
  if (typeof options !== "object") return;

  // Find the correct filter based on type
  let filter = type.map((t) => types.find((a) => a[t]));
  if (!filter.length || !filter[0]) return;

  filter = filter[0];
  type = type[0];

  // Validate method
  if (method === "set" && typeof options.content !== filter[type]) return;
  if (!methods.includes(method)) return;

  // Attempt to find existing data
  let data = await groupDb.findOne({
    where: {
      jid: options.jid,
    },
  });

  // Handle cases based on method
  if (!data) {
    if (method === "set") {
      const convert_required = filter[type] === "object";
      if (convert_required) options.content = JSON.stringify(options.content);
      await groupDb.create({
        jid: options.jid,
        [type]: options.content,
      });
      return true;
    } else if (method === "add") {
      const convert_required = filter[type] === "object";
      if (convert_required) options.content = JSON.stringify(options.content);
      data = await groupDb.create({
        jid: options.jid,
        [type]: options.content,
      });
      return convert_required
        ? JSON.parse(data.dataValues[type])
        : data.dataValues[type];
    } else if (method === "delete") {
      return false;
    } else {
      const msg = {};
      Object.keys(filter).forEach((key) => {
        msg[key] = false;
      });
      return msg;
    }
  } else {
    if (method === "set") {
      const convert_required = filter[type] === "object";
      if (convert_required) options.content = JSON.stringify(options.content);
      await data.update({
        [type]: options.content,
      });
      return true;
    } else if (method === "add") {
      const convert_required = filter[type] === "object";
      if (convert_required)
        options.content = JSON.stringify(
          jsonConcat(JSON.parse(data.dataValues[type]), options.content),
        );
      await data.update({
        [type]: options.content,
      });
      return convert_required
        ? JSON.parse(data.dataValues[type])
        : data.dataValues[type];
    } else if (method === "delete") {
      if (!options.content.id) return;
      const convert_required = filter[type] === "object";
      if (convert_required) {
        const json = JSON.parse(data.dataValues[type]);
        if (!json[options.content.id]) return false;
        delete json[options.content.id];
        options.content = JSON.stringify(json);
      }
      await data.update({
        [type]: options.content,
      });
      return true;
    } else {
      const msg = {};
      Object.keys(filter).forEach((key) => {
        const convert_required = filter[key] === "object";
        const value = convert_required
          ? JSON.parse(data.dataValues[key])
          : data.dataValues[key];
        msg[key] = value;
      });
      return msg;
    }
  }
}

module.exports = { groupDB };
