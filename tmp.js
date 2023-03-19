const axios = require("axios");
const cheerio = require("cheerio");
function IgDl(insta_url) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          "https://saveinsta.net/igram.php#downloadhere",
          {
            link: insta_url,
          }
        );
        const html = response.data;
        const $ = cheerio.load(html);
        const urls = $('a[target="_blank"]')
          .map((i, a) => $(a).attr("href"))
          .get();
          console.log({ status: 200, result: urls })
        resolve({ status: 200, result: urls });
      } catch (error) {
        console.log({ status: 404, result: error.message })
        console.log({ status: 404, result: urls })
        reject({ status: 404, result: "No url found" });
      }
    });
  }

  IgDl('https://www.instagram.com/p/Cp9zTs4ImjP/?utm_source=ig_web_copy_link')