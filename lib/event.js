/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/

var config = require("../config");
var commands = [];

function command(info, func) {
  let types = ['converter','downloader','game','group','heroku','tool','user','x-media','search','Textpro','Maker menu']
  var infos = info;
  infos.function = func;
  infos.pattern = new RegExp(
    `${config.HANDLERS}(${info.pattern}| ${info.pattern})`,
    `is`
  );
  if (!infos.dontAddCommandList) infos.dontAddCommandList = false;
  if (!infos.fromMe) infos.dontAddCommandList = false;
  if (!info.type||!types.includes(info.type)) infos.type = 'misc';
  commands.push(infos);
  return infos;
}
module.exports = {
  command,
  commands,
};
