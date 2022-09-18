const { getJson } = require("./lib");

let cmd = async () => {
    let match = process.argv[2]
    console.log(match)
  try {
    if (!match)
      return  console.log(
        "_Enter a tg sticker url\nEg: https://t.me/addstickers/Oldboyfinal_"
      );
    let packid = match.split("/addstickers/")[1]
    let { result } = await getJson(
      `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
        packid
      )}`
    );
    if (result.is_animated)
      return  console.log("_Animated stickers are not supported_");
    console.log(
      `*Total stickers :* ${
        result.stickers.length
      }\n*Estimated complete in:* ${
        result.stickers.length * 1.5
      } seconds`.trim()
    );
    for (let sticker of result.stickers) {
      let file_path = await getJson(
        `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${sticker.file_id}`
      )
     // console.log(file_path.result.file_path)

     console.log(
        `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file_path.result.file_path}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

cmd()