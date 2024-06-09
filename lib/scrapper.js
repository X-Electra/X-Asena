const { Innertube, UniversalCache, Utils } = require("youtubei.js");
const yts = require("yt-search");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const validQueryDomains = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "gaming.youtube.com",
]);

const validPathDomains =
  /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
const getURLVideoID = (link) => {
  const parsed = new URL(link.trim());
  let id = parsed.searchParams.get("v");
  if (validPathDomains.test(link.trim()) && !id) {
    const paths = parsed.pathname.split("/");
    id = parsed.host === "youtu.be" ? paths[1] : paths[2];
  } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
    throw Error("Not a YouTube domain");
  }
  if (!id) {
    throw Error(`No video id found: "${link}"`);
  }
  id = id.substring(0, 11);
  return id;
};

const ffmpeg = require("fluent-ffmpeg");
const googleTTS = require("google-tts-api");
const { translate } = require("@vitalets/google-translate-api");
const stream2buffer = async (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
};

async function searchYT(q) {
  try {
    const res = await yts(q);
    let aa = [];
    res.all
      .filter((a) => a.type == "video")
      .map((r) => aa.push({ title: r.title, url: r.url }));
    return aa;
  } catch (e) {
    return e;
  }
}
const downloadMp3 = async (url) => {
  let video_id = getURLVideoID(url);
  try {
    const yt = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });
    const stream = await yt.download(video_id, {
      type: "audio", // audio, video or video+audio
      quality: "bestefficiency", // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
      format: "mp4", // media container format
    });
    const buffers = [];
    for await (const data of Utils.streamToIterable(stream)) {
      buffers.push(data);
    }
    return Buffer.concat(buffers);
  } catch (e) {
    return "rejected";
  }
};
const downloadMp4 = async (url) => {
  let video_id = getURLVideoID(url);
  try {
    const yt = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });
    const stream = await yt.download(video_id, {
      type: "video+audio", // audio, video or video+audio
      quality: "bestefficiency", // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
      format: "mp4", // media container format
    });
    const buffers = [];
    for await (const data of Utils.streamToIterable(stream)) {
      buffers.push(data);
    }
    return Buffer.concat(buffers);
  } catch (e) {
    return "rejected";
  }
};

const TTS = async (text, lang) => {
  try {
    const options = {
      lang: lang,
      slow: false,
      host: "https://translate.google.com",
    };
    const audioBase64Array = await googleTTS.getAllAudioBase64(text, options);
    const base64Data = audioBase64Array.map((audio) => audio.base64).join();
    const fileData = Buffer.from(base64Data, "base64");
    fs.writeFileSync("tts.mp3", fileData, {
      encoding: "base64",
    });
    return new Promise((resolve) => {
      ffmpeg("tts.mp3")
        .audioCodec("libopus")
        .save("tts.opus")
        .on("end", async () => {
          resolve(fs.readFileSync("tts.opus"));
        });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
const TRT = async (text, lang = "en") => {
  const res = await translate(text, {
    to: lang,
    autoCorrect: true,
  }).catch((_) => "requst faild with status code 303");
  return res;
};
const getYTInfo = async (url) => {
  const video_id = getURLVideoID(url);
  const res = await yts({ videoId: video_id });
  const {
    title,
    description,
    seconds,
    uploaddate,
    views,
    thumbnail,
    author,
    videoId,
  } = res;
  return {
    title,
    description,
    seconds,
    uploaddate,
    views,
    thumbnail,
    author: author.name,
    videoId,
  };
};

const tiktokdl = async (url) => {
  let host = "https://www.tikwm.com/";
  let res = await axios.post(
    host + "api/",
    {},
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      },
      params: {
        url: url,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
    },
  );

  return {
    status: true,
    wm: host + res.data.data.wmplay,
    music: host + res.data.data.music,
    video: host + res.data.data.play,
  };
};
function fbdown(url) {
  return new Promise((resolve, reject) => {
    let data = {
      url: url,
    };
    axios
      .post(
        "https://www.getfvid.com/downloader",
        new URLSearchParams(Object.entries(data)),
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            cookie:
              "_ga=GA1.2.1310699039.1624884412; _pbjs_userid_consent_data=3524755945110770; cto_bidid=rQH5Tl9NNm5IWFZsem00SVVuZGpEd21sWnp0WmhUeTZpRXdkWlRUOSUyQkYlMkJQQnJRSHVPZ3Fhb1R2UUFiTWJuVGlhVkN1TGM2anhDT1M1Qk0ydHlBb21LJTJGNkdCOWtZalRtZFlxJTJGa3FVTG1TaHlzdDRvJTNE; cto_bundle=g1Ka319NaThuSmh6UklyWm5vV2pkb3NYaUZMeWlHVUtDbVBmeldhNm5qVGVwWnJzSUElMkJXVDdORmU5VElvV2pXUTJhQ3owVWI5enE1WjJ4ZHR5NDZqd1hCZnVHVGZmOEd0eURzcSUyQkNDcHZsR0xJcTZaRFZEMDkzUk1xSmhYMlY0TTdUY0hpZm9NTk5GYXVxWjBJZTR0dE9rQmZ3JTNEJTNE; _gid=GA1.2.908874955.1625126838; __gads=ID=5be9d413ff899546-22e04a9e18ca0046:T=1625126836:RT=1625126836:S=ALNI_Ma0axY94aSdwMIg95hxZVZ-JGNT2w; cookieconsent_status=dismiss",
          },
        },
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const normalVideo = $(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a",
        ).attr("href");
        const hdVideo = $(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a",
        ).attr("href");
        const audio = $(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a",
        ).attr("href");

        if (normalVideo && hdVideo && audio) {
          resolve({
            status: true,
            Normal_video: normalVideo,
            HD: hdVideo,
            audio: audio,
          });
        } else {
          reject({
            status: false,
            message: "Error retrieving video URLs",
          });
        }
      })
      .catch((error) => {
        reject({
          status: false,
          message: error.message,
        });
      });
  });
}
async function igdl(url) {
  try {
    const resp = await axios.post(
      "https://saveig.app/api/ajaxSearch",
      new URLSearchParams({ q: url, t: "media", lang: "en" }),
      {
        headers: {
          accept: "*/*",
          "user-agent": "PostmanRuntime/7.32.2",
        },
      },
    );
    let result = { status: true, data: [] };
    const $ = cheerio.load(resp.data.data);
    $(".download-box > li > .download-items").each(function () {
      result.data.push($(this).find(".download-items__btn > a").attr("href"));
    });
    return result;
  } catch (error) {
    const result = {
      status: false,
      message: "Couldn't fetch data of url",
      error: error.message,
    };
    console.log(result);
    return result;
  }
}

async function twitter(link) {
  return new Promise((resolve, reject) => {
    let config = {
      url: link,
    };
    axios
      .post(
        "https://www.expertsphp.com/instagram-reels-downloader.php",
        qs.stringify(config),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            cookie:
              "_gid=GA1.2.1209552833.1682995186; _gat_gtag_UA_120752274_1=1; __gads=ID=e2d27851a97b70ac-222d68fe87e000b0:T=1682995185:RT=1682995185:S=ALNI_MYaXoBa8KWleDZ97JpSaXGyI7nu3g; __gpi=UID=00000be71a67625d:T=1682995185:RT=1682995185:S=ALNI_MYyedH9xuRqL2hx4rg7YyeBDzK36w; _ga_D1XX1R246W=GS1.1.1682995185.1.1.1682995205.0.0.0; _ga=GA1.1.363250370.1682995185",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
          },
        },
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        resolve({
          status: true,
          video: $(
            "div.col-md-4.col-md-offset-4 > table > tbody > tr > td > video",
          ).attr("src"),
        });
      })
      .catch(reject);
  });
}

async function photoleap(text) {
  try {
    const { data } = await axios.get(
      "https://tti.photoleapapp.com/api/v1/generate?prompt=" + text,
    );
    const result = {
      status: true,
      url: data.result_url,
    };
    return result;
  } catch (err) {
    const result = {
      status: false,
      message: String(err),
    };
    console.log(result);
    return result;
  }
}
module.exports = {
  tiktokdl,
  twitter,
  photoleap,
  fbdown,
  igdl,
  stream2buffer,
  searchYT,
  downloadMp3,
  downloadMp4,
  TTS,
  TRT,
  getYTInfo,
};
