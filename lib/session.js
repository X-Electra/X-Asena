/* Copyright (C) 2022 Neeraj Krishna.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Millie WhatsApp Bot - Neeraj-x0
*/
const fs = require('fs')
const {writeFile} = require('fs/promises')
const PastebinAPI = require("pastebin-js"),
  pastebin = new PastebinAPI("h4cO2gJEMwmgmBoteYufW6_weLvBYCqT");
module.exports = {
  /**
   * Write Session To file
   * @param {string} session_id The Unique Id That you got
   * @param {string} authFile  The Session File name
   * Default Session name is "authfile"
   *
   * Make sure to Define global.authfile Before function
   *
   * Initialize at the top Body
   *
   * Make Sure To Give  a timeout of minimum 3 seconds for the Waconnection Function
   *
   *
   **/
  async MakeSession(session_id, authFile) {
    return new Promise((resolve, reject) => {
        code = session_id.replace(/_XASENA_/g, "");
        code = Buffer.from(code, "base64").toString("utf-8");
          pastebin
            .getPaste(code)
            .then(async function (data) {
              if (!fs.existsSync(authFile)) {
               await writeFile(authFile, data);
               resolve(true)
              }
            })
            .fail(function (err) {
                reject(err)
              console.log(err);
            });  
    })
    

  },
};
