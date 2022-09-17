const qs = require("qs");
const cheerio = require("cheerio");
const axios = require("axios");
function igdl(url_media) {
  return new Promise((resolve, reject) => {
    url_media = url_media.replace("reel", "p");
    var url = "https://inflact.com/downloader/instagram/video/";
    const requestBody = {
      url: url_media.replace("reel", "p"),
      lang_code: "en",
    };
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.75",
        "x-requested-with": " XMLHttpRequest",
        origin: "https://inflact.com",
        referer: "https://inflact.com/downloader/instagram/video/",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios
      .post(url, qs.stringify(requestBody), config)
      .then((result) => {
        console.log(result.data)
        let $ = cheerio.load(result.data),
          ig = [];
        //Obter todos os links de videos da pagina carregada
        $("[data-mediatype=Video]").each((i, element) => {
          let cheerioElement = $(element);
          ig.push(cheerioElement.attr("href"));
        });
        //Obter todos os links de imagem da pagina carregada
        $("div > div.bg-white.border.rounded-sm.max-w-md > img").each(
          (i, element) => {
            let cheerioElement = $(element);
            ig.push(cheerioElement.attr("src"));
          }
        );
        resolve({
          results_number: ig.length,
          url_list: ig,
        });
      })
      .catch((err) => {
        console.log(err.response);
        reject(err);
      });
  });
}
igdl("https://www.instagram.com/reel/CihysBxpGX-/?igshid=YmMyMTA2M2Y=");
