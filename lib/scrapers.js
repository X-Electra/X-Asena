/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/
const { JSDOM } = require("jsdom");
const FormData = require("form-data");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const axios = require("axios");
const qs = require("qs");

module.exports = {
  aiovideodl,
  filmapik,
  ssweb,
  hoax,
  sfilesearch,
  happymod,
  servermc,
  gempa,
  mediafire,
  telegraph,
  ghstalk,
  komiku,
  lyric,
  covid,
  otaku,
  shoppe,
  inews,
  jalantikus,
  kompasnews,
  tribunnews,
  tafsirsurah,
  surah,
  listsurah,
  stickersearch,
  drakor,
  mangatoons,
  webtoons,
  wattpaduser,
  wattpad,
  film,
  pinterest,
  jadwalsholat,
  jadwaltv,
  jadwalbola,
  character,
  manga,
  anime,
  soundcloud,
  xnxxsearch,
  xnxxdl,
  herodetails,
  herolist,
  playstore,
  tiktokporn,
  hentai,
  quotesanime,
  wallpaper,
  wikimedia,
  facebook,
  facebook2,
  _token,
  quotes,
  igdl,
  igstory,
  igstory2,
  snaptik,
  tiktok,
  twitter,
  joox,
  pin,
};

function tiktok(url) {
  return new Promise(async (resolve, reject) => {
    axios
      .get("https://ttdownloader.com/", {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie:
            "PHPSESSID=9ut8phujrprrmll6oc3bist01t; popCookie=1; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
        },
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        let token = $("#token").attr("value");
        let config = {
          url: url,
          format: "",
          token: token,
        };
        axios("https://ttdownloader.com/req/", {
          method: "POST",
          data: new URLSearchParams(Object.entries(config)),
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            cookie:
              "PHPSESSID=9ut8phujrprrmll6oc3bist01t; popCookie=1; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
          },
        }).then(({ data }) => {
          const $ = cheerio.load(data);
          resolve({
            nowm: $("div:nth-child(2) > div.download > a").attr("href"),
            wm: $("div:nth-child(3) > div.download > a").attr("href"),
            audio: $("div:nth-child(4) > div.download > a").attr("href"),
          });
        });
      })
      .catch(reject);
  });
}

function _token(host) {
  return new Promise(async (resolve, reject) => {
    axios
      .request({
        url: host,
        method: "GET",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie:
            "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
        },
      })
      .then(({ data }) => {
        let $ = cheerio.load(data);
        let token = $("#token").attr("value");
        resolve(token);
      });
  });
}

function wallpaper(title, page = 1) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`
      )
      .then(({ data }) => {
        let $ = cheerio.load(data);
        let hasil = [];
        $("div.grid-item").each(function (a, b) {
          hasil.push({
            title: $(b).find("div.info > a > h3").text(),
            type: $(b).find("div.info > a:nth-child(2)").text(),
            image: $(b).find("img").attr("src"),
          });
        });
        resolve(hasil);
      });
  });
}

function wikimedia(title) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`
      )
      .then((res) => {
        let $ = cheerio.load(res.data);
        let hasil = [];
        $(".sdms-search-results__list-wrapper > div > a").each(function (a, b) {
          hasil.push({
            title: $(b).find("img").attr("alt"),
            source: $(b).attr("href"),
            image: $(b).find("img").attr("src") || $(b).find("img").attr("src"),
          });
        });
        resolve(hasil);
      });
  });
}

function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = "https://www.xnxx.com";
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {
      method: "get",
    })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        let title = [];
        let url = [];
        let desc = [];
        let results = [];

        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb")
            .each(function (c, d) {
              url.push(
                baseurl + $(d).find("a").attr("href").replace("/THUMBNUM/", "/")
              );
            });
        });
        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb-under")
            .each(function (c, d) {
              desc.push($(d).find("p.metadata").text());
              $(d)
                .find("a")
                .each(function (e, f) {
                  title.push($(f).attr("title"));
                });
            });
        });
        for (let i = 0; i < title.length; i++) {
          results.push({
            title: title[i],
            info: desc[i],
            link: url[i],
          });
        }
        resolve({
          code: 200,
          status: true,
          result: results,
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}

function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: "get" })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        const title = $('meta[property="og:title"]').attr("content");
        const duration = $('meta[property="og:duration"]').attr("content");
        const image = $('meta[property="og:image"]').attr("content");
        const videoType = $('meta[property="og:video:type"]').attr("content");
        const videoWidth = $('meta[property="og:video:width"]').attr("content");
        const videoHeight = $('meta[property="og:video:height"]').attr(
          "content"
        );
        const info = $("span.metadata").text();
        const videoScript = $("#video-player-bg > script:nth-child(6)").html();
        const files = {
          low: (videoScript.match("html5player.setVideoUrlLow\\('(.*?)'\\);") ||
            [])[1],
          high: videoScript.match(
            "html5player.setVideoUrlHigh\\('(.*?)'\\);" || []
          )[1],
          HLS: videoScript.match(
            "html5player.setVideoHLS\\('(.*?)'\\);" || []
          )[1],
          thumb: videoScript.match(
            "html5player.setThumbUrl\\('(.*?)'\\);" || []
          )[1],
          thumb69: videoScript.match(
            "html5player.setThumbUrl169\\('(.*?)'\\);" || []
          )[1],
          thumbSlide: videoScript.match(
            "html5player.setThumbSlide\\('(.*?)'\\);" || []
          )[1],
          thumbSlideBig: videoScript.match(
            "html5player.setThumbSlideBig\\('(.*?)'\\);" || []
          )[1],
        };
        resolve({
          status: 200,
          result: {
            title,
            URL,
            duration,
            image,
            videoType,
            videoWidth,
            videoHeight,
            info,
            files,
          },
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
}

async function soundcloud(url) {
  return new Promise((resolve, reject) => {
    axios({
      url: "https://aiovideodl.ml/",
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie:
          "PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;",
      },
    }).then((data) => {
      let a = cheerio.load(data.data);
      let token = a("#token").attr("value");
      const options = {
        method: "POST",
        url: `https://aiovideodl.ml/wp-json/aio-dl/video-data/`,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie:
            "PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;",
        },
        formData: { url: url, token: token },
      };
      request(options, async function (error, response, body) {
        if (error) throw new Error(error);
        res = JSON.parse(body);
        res.status = 200;
        res.author = author;
        resolve(res);
      });
    });
  });
}

function anime(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.anime-planet.com/anime/all?name=${query}`)
      .then(({ data }) => {
        const hasil = [];
        const $ = cheerio.load(data);
        $("#siteContainer > ul.cardDeck.cardGrid > li ").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            judul: $(b).find("> a > h3").text(),
            link:
              "https://www.anime-planet.com" + $(b).find("> a").attr("href"),
            thumbnail:
              "https://www.anime-planet.com" +
              $(b).find("> a > div.crop > img").attr("src"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function manga(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.anime-planet.com/manga/all?name=${query}`)
      .then(({ data }) => {
        const hasil = [];
        const $ = cheerio.load(data);
        $("#siteContainer > ul.cardDeck.cardGrid > li ").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            judul: $(b).find("> a > h3").text(),
            link:
              "https://www.anime-planet.com" + $(b).find("> a").attr("href"),
            thumbnail:
              "https://www.anime-planet.com" +
              $(b).find("> a > div.crop > img").attr("src"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function character(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.anime-planet.com/characters/all?name=${query}`)
      .then(({ data }) => {
        const hasil = [];
        const $ = cheerio.load(data);
        $("#siteContainer > table > tbody > tr").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            character: $(b).find("> td.tableCharInfo > a").text(),
            link:
              "https://www.anime-planet.com" +
              $(b).find("> td.tableCharInfo > a").attr("href"),
            thumbnail: $(b)
              .find("> td.tableAvatar > a > img")
              .attr("src")
              .startsWith("https://")
              ? $(b).find("> td.tableAvatar > a > img").attr("src")
              : "https://www.anime.planet.com" +
                $(b).find("> td.tableAvatar > a > img").attr("src"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function jadwalbola() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://m.bola.net/jadwal_televisi/")
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("#main_mid_headline_sub_topic").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            jadwal: $(b)
              .find(" > div.main_mid_headline_topic > div > a")
              .text(),
            tanggal: $(b)
              .find(" > div.main_mid_headline_topic_grouped_time_list")
              .text()
              .split("\n")[1]
              .split("                            ")[1],
            jam: $(b).find(" > div.main_mid_headline_topic > span").text(),
            url: $(b)
              .find(" > div.main_mid_headline_topic > div > a")
              .attr("href"),
            thumb: $(b)
              .find(" > div.main_mid_headline_topic > img")
              .attr("src"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function jadwaltv() {
  return new Promise((resolve, reject) => {
    axios
      .get("http://www.dokitv.com/jadwal-acara-tv")
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("#tabeljadwaltv > tbody > tr ").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            acara: $(b).find("> td:nth-child(2)").text(),
            channel: $(b).find("> td > a").text(),
            jam: $(b).find("> td.jfx").text(),
            source: $(b).find("> td > a").attr("href"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function jadwalsholat(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://umrotix.com/jadwal-sholat/${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        $(
          "body > div > div.main-wrapper.scrollspy-action > div:nth-child(3) "
        ).each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            tanggal: $(b).find("> div:nth-child(2)").text(),
            imsyak: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)"
              )
              .text(),
            subuh: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)"
              )
              .text(),
            dzuhur: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)"
              )
              .text(),
            ashar: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)"
              )
              .text(),
            maghrib: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)"
              )
              .text(),
            isya: $(b)
              .find(
                "> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)"
              )
              .text(),
          };
          resolve(result);
        });
      })
      .catch(reject);
  });
}

function pinterest(query) {
  return new Promise((resolve, reject) => {
    axios(
      `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`
    )
      .then((data) => {
        const random =
          data.data.resource_response.data.results[
            Math.floor(
              Math.random() * data.data.resource_response.data.results.length
            )
          ];
        var result = [];
        result = {
          status: 200,
          author: "Xasena",
          url: random.images.orig.url,
        };
        resolve(result);
      })
      .catch(reject);
  });
}

function film(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://167.99.31.48/?s=${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("#content > div > div.los").each(function (a, b) {
          $(b)
            .find("article")
            .each(function (c, d) {
              const judul = $(d)
                .find("div > a > div.addinfox > header > h2")
                .text();
              const quality = $(d).find("div > a > div > div > span").text();
              const type = $(d)
                .find("div > a > div.addinfox > div > i.type")
                .text();
              const upload = $(d)
                .find("div > a > div.addinfox > div > span")
                .text();
              const link = $(d).find("div > a").attr("href");
              const thumb = $(d).find("div > a > div > img").attr("src");
              const result = {
                status: 200,
                author: "Xasena",
                judul: judul,
                quality: quality,
                type: type,
                upload: upload,
                link: link,
                thumb: thumb,
              };
              hasil.push(result);
            });
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function wattpad(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.wattpad.com/search/${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("div.story-card-data.hidden-xxs > div.story-info ").each(function (
          a,
          b
        ) {
          $("ul.list-group > li.list-group-item").each(function (c, d) {
            result = {
              status: 200,
              author: "Xasena",
              judul: $(b).find("> div.title").text(),
              dibaca: $(b)
                .find(
                  "> ul > li:nth-child(1) > div.icon-container > div > span.stats-value"
                )
                .text(),
              divote: $(b)
                .find(
                  "> ul > li:nth-child(2) > div.icon-container > div > span.stats-value"
                )
                .text(),
              bab: $(b)
                .find(
                  "> ul > li:nth-child(3) > div.icon-container > div > span.stats-value"
                )
                .text(),
              waktu: $(b)
                .find(
                  "> ul > li:nth-child(4) > div.icon-container > div > span.stats-value"
                )
                .text(),
              url: "https://www.wattpad.com" + $(d).find("a").attr("href"),
              thumb: $(d).find("img").attr("src"),
              description: $(b)
                .find("> div.description")
                .text()
                .replace(/\n/g, ""),
            };
            hasil.push(result);
          });
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function wattpaduser(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.wattpad.com/user/${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        $("#app-container > div > header ").each(function (a, b) {
          $("#profile-about > div > div ").each(function (c, d) {
            result = {
              status: 200,
              author: "Xasena",
              username: $(b).find("> div.badges > h1").text().trim(),
              works: $(b)
                .find(
                  "> div.row.header-metadata > div:nth-child(1) > p:nth-child(1)"
                )
                .text(),
              reading_list: $(b)
                .find(
                  "> div.row.header-metadata > div.col-xs-4.scroll-to-element > p:nth-child(1)"
                )
                .text(),
              followers: $(b)
                .find(
                  "> div.row.header-metadata > div.col-xs-4.on-followers > p.followers-count"
                )
                .text(),
              joined: $(d)
                .find("> ul > li.date.col-xs-12.col-sm-12 > span")
                .text()
                .trim()
                .replace("Joined", ""),
              pp_picture: `https://img.wattpad.com/useravatar/${query}.128.851744.jpg`,
              about: $(d).find("> div.description > pre").text()
                ? $(d).find("> div.description > pre").text()
                : "Not found",
            };
            resolve(result);
          });
        });
      })
      .catch(reject);
  });
}

function webtoons(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.webtoons.com/id/search?keyword=${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("#content > div.card_wrap.search._searchResult > ul > li ").each(
          function (a, b) {
            result = {
              status: 200,
              author: "Xasena",
              judul: $(b).find("> a > div > p.subj").text(),
              like: $(b).find("> a > div > p.grade_area > em").text(),
              creator: $(b).find("> a > div > p.author").text(),
              genre: $(b).find("> a > span").text(),
              thumbnail: $(b).find("> a > img").attr("src"),
              url: "https://www.webtoons.com" + $(b).find("> a").attr("href"),
            };
            hasil.push(result);
          }
        );
        resolve(hasil);
      })
      .catch(reject);
  });
}

function mangatoons(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://mangatoon.mobi/en/search?word=${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $(
          "#page-content > div.search-page > div > div.comics-result > div.recommended-wrap > div > div "
        ).each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            judul: $(b).find("> div.recommend-comics-title > span").text(),
            genre: $(b).find("> div.comics-type > span").text().trim(),
            link: "https://mangatoon.mobi" + $(b).find("> a").attr("href"),
            thumbnail: $(b).find("> a > div > img").attr("src"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function drakor(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://drakorasia.blog//?s=${query}&post_type=post`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("#post > div ").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            judul: $(b)
              .find(
                "> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a > h2"
              )
              .text()
              .trim(),
            years: $(b)
              .find(
                "> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > div.category.text-gray.font-normal.text-white.text-xs.truncate > a"
              )
              .text(),
            genre: $(b)
              .find(
                "> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > div.genrenya.text-center.text-white.text-opacity-75.text-xs.mt-1"
              )
              .text()
              .trim(),
            thumbnail: $(b).find("> div.thumbnail > a > img").attr("src"),
            url: $(b)
              .find(
                "> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a"
              )
              .attr("href"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function stickersearch(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://getstickerpack.com/stickers?query=${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const source = [];
        const link = [];
        $("#stickerPacks > div > div:nth-child(3) > div > a").each(function (
          a,
          b
        ) {
          source.push($(b).attr("href"));
        });
        axios
          .get(source[Math.floor(Math.random() * source.length)])
          .then(({ data }) => {
            const $$ = cheerio.load(data);
            $$("#stickerPack > div > div.row > div > img").each(function (
              c,
              d
            ) {
              link.push(
                $$(d)
                  .attr("src")
                  .replace(/&d=200x200/g, "")
              );
            });
            result = {
              status: 200,
              author: "Xasena",
              title: $$("#intro > div > div > h1").text(),
              sticker_url: link,
            };
            resolve(result);
          });
      })
      .catch(reject);
  });
}

function listsurah() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://litequran.net/")
      .then(({ data }) => {
        const $ = cheerio.load(data);
        let listsurah = [];
        $("body > main > section > ol > li > a").each(function (a, b) {
          listsurah.push($(b).text());
        });
        result = {
          status: 200,
          author: "Xasena",
          listsurah: listsurah,
        };
        resolve(result);
      })
      .catch(reject);
  });
}

function surah(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://litequran.net/${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("body > main > article > ol > li").each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            arab: $(b).find("> span.ayat").text(),
            latin: $(b).find("> span.bacaan").text(),
            translate: $(b).find("> span.arti").text(),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function tafsirsurah(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://tafsirq.com/topik/${query}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $("body > div:nth-child(4) > div > div.col-md-6 > div ").each(function (
          a,
          b
        ) {
          result = {
            status: 200,
            author: "Xasena",
            surah: $(b)
              .find("> div.panel-heading.panel-choco > div > div > a")
              .text(),
            tafsir: $(b).find("> div.panel-body.excerpt").text().trim(),
            type: $(b)
              .find("> div.panel-heading.panel-choco > div > div > span")
              .text(),
            source: $(b)
              .find("> div.panel-heading.panel-choco > div > div > a")
              .attr("href"),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function jalantikus(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://jalantikus.com/search/articles/${query}/`)
      .then((tod) => {
        const $ = cheerio.load(tod.data);
        hasil = [];
        $("div.post-block-with-category").each(function (c, d) {
          title = $(d).find("a.post-block-with-category__link").text();
          category = $(d).find("a.post-info__category-link").text();
          date = $(d).find("time").text();
          link = `https://jalantikus.com${$(d).find("a").attr("href")}`;
          const Data = {
            title: title,
            category: category,
            date: date,
            link: link,
          };
          hasil.push(Data);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function tribunnews() {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.tribunnews.com/news`)
      .then((tod) => {
        const $ = cheerio.load(tod.data);
        hasil = [];
        $("li.p1520.art-list.pos_rel").each(function (c, d) {
          title = $(d)
            .find("div.mr140 > h3 > a.f20.ln24.fbo.txt-oev-2")
            .text()
            .trim();
          thumb = $(d)
            .find("div.fr.mt5.pos_rel > a > img.shou2.bgwhite")
            .attr("src");
          desc = $(d).find("div.grey2.pt5.f13.ln18.txt-oev-3").text().trim();
          date = $(d).find("div.grey.pt5 > time.foot.timeago").text().trim();
          link = $(d).find("div.fr.mt5.pos_rel > a").attr("href");
          const Data = {
            title: title,
            thumb: thumb,
            desc: desc,
            date: date,
            link: link,
          };
          hasil.push(Data);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function kompasnews() {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://news.kompas.com/`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];
        $(
          "body > div > div.container.clearfix > div:nth-child(3) > div.col-bs10-7 > div:nth-child(3) > div.latest.ga--latest.mt2.clearfix > div > div "
        ).each(function (a, b) {
          result = {
            status: 200,
            author: "Xasena",
            berita: $(b).find("> div > div.article__box > h3").text(),
            upload_time: $(b)
              .find("> div > div.article__box > div.article__date")
              .text(),
            type_berita: $(b)
              .find("> div > div.article__boxsubtitle > h2")
              .text(),
            link: $(b).find("> div > div.article__box > h3 > a").attr("href"),
            thumbnail: $(b)
              .find("> div > div.article__asset > a > img")
              .attr("data-src"),
            info_berita: $(b)
              .find("> div > div.article__box > div.article__lead")
              .text(),
          };
          hasil.push(result);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function lyric(judul) {
  return new Promise(async (resolve, reject) => {
    axios
      .get("https://www.musixmatch.com/search/" + judul)
      .then(async ({ data }) => {
        const $ = cheerio.load(data);
        const hasil = {};
        let limk = "https://www.musixmatch.com";
        const link =
          limk + $("div.media-card-body > div > h2").find("a").attr("href");
        await axios.get(link).then(({ data }) => {
          const $$ = cheerio.load(data);
          hasil.thumb =
            "https:" +
            $$(
              "div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div"
            )
              .find("img")
              .attr("src");
          $$("div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics").each(
            function (a, b) {
              hasil.lyric =
                $$(b).find("span > p > span").text() +
                "\n" +
                $$(b).find("span > div > p > span").text();
            }
          );
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function ghstalk(username) {
  url = `https://api.github.com/users/${username}`;
  return axios.get(url).then((data) => {
    return data.data;
  });
}

async function telegraph(buffer) {
  return new Promise(async (resolve, reject) => {
    const { ext } = await fromBuffer(buffer);
    let form = new FormData();
    form.append("file", buffer, "tmp." + ext);
    let res = await fetch("https://telegra.ph/upload", {
      method: "POST",
      body: form,
    });
    let img = await res.json();
    if (img.error) throw img.error;
    hasil = "https://telegra.ph" + img[0].src;
    resolve({ hasil });
    console.log(hasil);
  }).catch(reject);
}

function servermc() {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://minecraftpocket-servers.com/country/india/`)
      .then((tod) => {
        const $ = cheerio.load(tod.data);
        hasil = [];
        $("tr").each(function (c, d) {
          ip = $(d)
            .find("button.btn.btn-secondary.btn-sm")
            .eq(1)
            .text()
            .trim()
            .replace(":19132", "");
          port = "19132";
          versi = $(d).find("a.btn.btn-info.btn-sm").text();
          player = $(d)
            .find("td.d-none.d-md-table-cell > strong")
            .eq(1)
            .text()
            .trim();
          const Data = {
            ip: ip,
            port: port,
            versi: versi,
            player: player,
          };
          hasil.push(Data);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function happymod(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.happymod.com/search.html?q=${query}`)
      .then(async (tod) => {
        const $ = cheerio.load(tod.data);
        hasil = [];
        $("div.pdt-app-box").each(function (c, d) {
          name = $(d).find("a").text().trim();
          icon = $(d).find("img.lazy").attr("data-original");
          link = $(d).find("a").attr("href");
          link2 = `https://www.happymod.com${link}`;
          const Data = {
            icon: icon,
            name: name,
            link: link2,
          };
          hasil.push(Data);
        });
        resolve(hasil);
      })
      .catch(reject);
  });
}

function aiovideodl(link) {
  return new Promise((resolve, reject) => {
    axios({
      url: "https://aiovideodl.ml/",
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie:
          "PHPSESSID=69ce1f8034b1567b99297eee2396c308; _ga=GA1.2.1360894709.1632723147; _gid=GA1.2.1782417082.1635161653",
      },
    }).then((src) => {
      let a = cheerio.load(src.data);
      let token = a("#token").attr("value");
      axios({
        url: "https://aiovideodl.ml/wp-json/aio-dl/video-data/",
        method: "POST",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie:
            "PHPSESSID=69ce1f8034b1567b99297eee2396c308; _ga=GA1.2.1360894709.1632723147; _gid=GA1.2.1782417082.1635161653",
        },
        data: new URLSearchParams(Object.entries({ url: link, token: token })),
      }).then(({ data }) => {
        resolve({ status: src.status, creator: "Xasena", hasil: data });
      });
    });
  });
}

async function mediafire(url) {
  let query = await axios.get(url);
  let cher = cheerio.load(query.data);
  let hasil = [];
  let link = cher("a#downloadButton").attr("href");
  let size = cher("a#downloadButton")
    .text()
    .replace("Download", "")
    .replace("(", "")
    .replace(")", "")
    .replace("\n", "")
    .replace("\n", "")
    .replace(" ", "");
  let seplit = link.split("/");
  let author = "Xasena";
  let nama = seplit[5];
  let mime = nama.split(".");
  mime = mime[1];
  hasil.push({ author, nama, mime, size, link });
  return hasil;
}
