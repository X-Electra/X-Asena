const { bot, Imgur, mode } = require("../lib/");
const ffmpeg = require("fluent-ffmpeg");
bot(
  {
    pattern: "url ?(.*)",
    fromMe: mode,
    desc: "upload files to imgur.com",
    type: "media",
  },
  async (m, text, client) => {
    if (!m.quoted) return m.reply("Reply to a video/image/audio!");
    if (/image/.test(m.type)) {
      const media = await m.reply_message.downloadAndSaveMedia();
      const res = await Imgur(media);
      await m.reply(res.link);
    } else if (/video/.test(m.type)) {
      const media = await m.reply_message.downloadAndSaveMedia();
      const res = await Imgur(media);
      await m.reply(res.link);
    } else if (/audio/.test(m.type)) {
      try {
        const media = await m.reply_message.downloadAndSaveMedia();
        ffmpeg(media)
          .outputOptions([
            "-y",
            "-filter_complex",
            "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]",
            "-map",
            "[vid]",
            "-map 0:a",
          ])
          .save("output.mp4")
          .on("end", async () => {
            var res = await Imgur("output.mp4");
            await m.reply(res.link);
          });
      } catch (e) {
        await m.reply(e.message);
      }
    } else {
      return m.reply("Reply to a video/image/audio!");
    }
  }
);
