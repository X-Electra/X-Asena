/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

var config = require("../config");
var commands = [];

function command(info, func) {
  var types = ["photo", "image", "text", "message", "video", "sticker"];

  var infos = info;
  infos.function = func;
  if (info["on"] === undefined && info["pattern"] === undefined) {
    infos.on = "message";
    infos.fromMe = false;
  } else if (info["on"] !== undefined && types.includes(info["on"])) {
    infos.on = info["on"];

    if (info["pattern"] !== undefined) {
      infos.pattern = new RegExp(
        (info["handler"] === undefined || info["handler"] === true
          ? config.HANDLERS
          : "") + info.pattern,
        info["flags"] !== undefined ? info["flags"] : ""
      );
    }
  } else {
    infos.pattern = new RegExp(
      (info["handler"] === undefined || info["handler"] === true
        ? config.HANDLERS
        : "") + info.pattern
    );
  }

  commands.push(infos);
  return infos;
}
module.exports = {
  command,
  commands,
};
