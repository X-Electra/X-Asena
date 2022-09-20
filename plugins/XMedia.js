const { command } = require("../lib/");
const { Mimetype } = require("@adiwajshing/baileys");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

command(
  {
    pattern: "codtts",
    fromMe: false,
    desc: "language code to change the voice in .tts & also for .trt translation",
  },
  async (message) => {
    await message.sendMessage(
      "\n https://drive.google.com/file/d/1r4l7QcdEiu9wAOgqxTGB6KWBVsg_U1cu/view?usp=drivesdk \n"
    );
  }
);

command(
  {
    pattern: "x4mp4",
    fromMe: true,
    desc: "Reduce video’s quality by 75%.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message.video)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .withSize("25%")
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "x2mp4",
    fromMe: true,
    desc: "Reduce video’s quality by 50%",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message.video)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .withSize("50%")
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp4image",
    fromMe: true,
    desc: "Converts photo to 5 sec video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message.image)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .loop(6)
      .fps(19)
      .videoBitrate(400)
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "spectrum",
    fromMe: true,
    desc: "Converts the spectrum of sound into video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-filter_complex",
        "[0:a]showspectrum=s=720x1280,format=yuv420p[v]",
        "-map",
        "[v]",
        "-map 0:a",
      ])
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "waves",
    fromMe: true,
    desc: "Converts the wave range of sound to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-filter_complex",
        "[0:a]showwaves=s=720x1280:mode=cline:rate=25,format=yuv420p[v]",
        "-map",
        "[v]",
        "-map 0:a",
      ])
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "frequency",
    fromMe: true,
    desc: "Converts the frequency range of sound to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-filter_complex",
        "[0:a]showfreqs=s=720x1280:mode=cline:fscale=log,format=yuv420p[v]",
        "-map",
        "[v]",
        "-map 0:a",
      ])
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "avec",
    fromMe: true,
    desc: "Converts the histogram of sound to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-filter_complex",
        "[0:a]avectorscope=s=720x1280:rf=5:gf=25:bf=5:draw=line,format=yuv420p[v]",
        "-map",
        "[v]",
        "-map 0:a",
      ])
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "volumeaudio",
    fromMe: true,
    desc: "Converts the decibel value of the sound into video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
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
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "cqtaudio",
    fromMe: true,
    desc: "Converts the CQT value of audio to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-filter_complex",
        "[0:a]showcqt=s=1280x720,format=yuv420p[v]",
        "-map",
        "[v]",
        "-map 0:a",
      ])
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp3eq",
    fromMe: true,
    desc: "Adjusts the sound to a crystal clear level.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-af",
        "superequalizer=1b=10:2b=10:3b=1:4b=5:5b=7:6b=5:7b=2:8b=3:9b=4:10b=5:11b=6:12b=7:13b=8:14b=8:15b=9:16b=9:17b=10:18b=10[a];[a]loudnorm=I=-16:TP=-1.5:LRA=14",
        "-ar 48k",
      ])
      .save("output.mp3")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
      });
  }
);

command(
  {
    pattern: "mp3crusher",
    fromMe: true,
    desc: "Distorts the sound, makes ridiculous.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-filter_complex",
        "acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1",
      ])
      .save("output.mp3")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
      });
  }
);

command(
  {
    pattern: "mp3reverse",
    fromMe: true,
    desc: "Plays the sound in reverse.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-filter_complex", "areverse"])
      .save("output.mp3")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
      });
  }
);

command(
  {
    pattern: "mp4vintage",
    fromMe: true,
    desc: "Applies a nostalgic effect to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "curves=vintage,format=yuv420p"])
      .fps(22)
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp4reverse",
    fromMe: true,
    desc: "Plays the video in reverse.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "reverse", "-af", "areverse"])
      .format("mp4")
      .fps(22)
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp4bw",
    fromMe: true,
    desc: "Applies a monochrome effect to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "hue=s=0"])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "bwimage",
    fromMe: true,
    desc: "Applies a monochrome effect to image.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "hue=s=0"])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "vintageimage",
    fromMe: true,
    desc: "Applies a vinatge effect to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "curves=vintage"])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp4enhance",
    fromMe: true,
    desc: "Enhance video’s quality",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "unsharp=3:3:1.5"])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "blurimage",
    fromMe: true,
    desc: "Blurs the background of the photo.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "split[original][copy];[copy]scale=ih*16/9:-1,crop=h=iw*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2",
      ])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp4blur",
    fromMe: true,
    desc: "Blurs the background of the video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "split[original][copy];[copy]scale=ih*16/9:-1,crop=h=iw*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2",
      ])
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp3pitch",
    fromMe: true,
    desc: "Makes the sound thinner and faster.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-af", "asetrate=44100*1.3"])
      .save("output.mp3")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
      });
  }
);

command(
  {
    pattern: "mp4edge",
    fromMe: true,
    desc: "Applies a edge effect to the video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Edging Video..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-codec:v",
        "mpeg4",
        "-filter:v",
        "edgedetect=low=0.9:high=0.3",
      ])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp3low",
    fromMe: true,
    desc: "Makes the sound deep and slower.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-af", "asetrate=44100*0.9"])
      .save("output.mp3")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
      });
  }
);

command(
  {
    pattern: "x2mp3",
    fromMe: true,
    desc: "Makes the sound twice as fast.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Audio!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-filter:a", "atempo=2.0", "-vn"])
      .save("output.mp3")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
      });
  }
);

command(
  {
    pattern: "edgeimage",
    fromMe: true,
    desc: "Applies a edge effect to the photo.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo*");
    await message.sendMessage("```Edging Image..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-filter:v", "edgedetect=low=0.9:high=0.2"])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "enhanceimage",
    fromMe: true,
    desc: "Makes the photo clearer.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Converting..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "unsharp=3:3:1.5"])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp3volume",
    fromMe: true,
    desc: "Increase sound level",
    dontAddCommandList: false,
  },
  async (message, match) => {
    if (!message.reply_message)
      return await message.sendMessage("*Need Audio!*");
    if (!match) {
      return await message.reply("Need a volume level");
    } else {
      await message.sendMessage("```Editing..```");
      var location = await message.reply_message.downloadMediaMessage();

      ffmpeg(location)
        .outputOptions(["-y", "-filter:a", `volume=${parseFloat(match)}`])
        .save("output.mp3")
        .on("end", async () => {
          await message.sendMessage(fs.readFileSync("output.mp3"), {}, "audio");
        });
    }
  }
);

command(
  {
    pattern: "gif",
    fromMe: true,
    desc: "Converts video to gif.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("Need Video!");
    await message.sendMessage("```Converting to Gif..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .noAudio()
      .fps(13)
      .videoBitrate(500)
      .save("output_gif.mp4")
      .on("end", async () => {
        await message.sendMessage(
          fs.readFileSync("output_gif.mp4"),
          {
            mimetype: "video/gif",
          },
          "video"
        );
      });
  }
);

command(
  {
    pattern: "vgif",
    fromMe: true,
    desc: "Converts video to voiced gif.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("Need Video!");
    await message.sendMessage("```Converting to Gif..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .fps(13)
      .videoBitrate(500)
      .save("output_gif.mp4")
      .on("end", async () => {
        await message.sendMessage(
          fs.readFileSync("output_gif.mp4"),
          {
            mimetype: "video/gif",
          },
          "video"
        );
      });
  }
);

command(
  {
    pattern: "grenimage",
    fromMe: true,
    desc: "Applies grain effect to the photo",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("Need Photo!");
    await message.sendMessage("```Adding Grain..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .videoFilters("noise=alls=100:allf=t+u")
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "interp ?(.*)",
    fromMe: true,
    desc: "Increases the FPS of the video.",
    dontAddCommandList: false,
  },
  async (message, match) => {
    if (!message.reply_message.video)
      return await message.sendMessage(
        "*Need Video and FPS Value!*\nEx: ```.interp 100```"
      );
    if (message.reply_message.video && match <= 10)
      return await message.sendMessage(
        "*Low FPS Value ⚠️*\n*Please, type over 10*"
      );
    if (message.reply_message.video && match >= 500)
      return await message.sendMessage(
        "*High FPS Value ⚠️*\n*Please, type under 500*"
      );

    await message.sendMessage("```Interpolating..```");
    var location = await message.reply_message.downloadMediaMessage();
    await message.sendMessage("_This process may take a while.._");

    ffmpeg(location)
      .videoFilters(`minterpolate=fps=${match}:mi_mode=mci:me_mode=bidir`)
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {
          caption: `Made by WhatsAsena\n_Interpolated to ${match} FPS_`,
        });
      });
  }
);

command(
  {
    pattern: "rainbow",
    fromMe: true,
    desc: "Applies rainbow effect to the photo",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)",
      ])
      .videoFilters("eq=brightness=0.5")
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp4rainbow",
    fromMe: true,
    desc: "Applies a rainbow effect to video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)",
        "-pix_fmt yuv420p",
      ])
      .videoFilters("eq=brightness=0.5")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "negative",
    fromMe: true,
    desc: "Applies a negative color filter to the photo.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "curves=color_negative"])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp4negative",
    fromMe: true,
    desc: "Applies a negative color filter to the video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "curves=color_negative,format=yuv420p"])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "mp4art",
    fromMe: true,
    desc: "Applies a art effect to the video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "convolution=-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2,format=yuv420p",
      ])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "artimage",
    fromMe: true,
    desc: "Applies a art effect to the photo.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "convolution=-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2",
      ])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp4stab",
    fromMe: true,
    desc: "Decreases the vibration of the video.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions(["-y", "-vf", "deshake,format=yuv420p"])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "vivid",
    fromMe: true,
    desc: "Makes the colors of the video more vivid and beautiful.",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "eq=contrast=1.3:saturation=1.5:brightness=-0.1,format=yuv420p",
      ])
      .format("mp4")
      .save("output.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.mp4"), {}, "video");
      });
  }
);

command(
  {
    pattern: "colorimage",
    fromMe: true,
    desc: "It makes the colors of the photo more vivid and attractive",
    dontAddCommandList: false,
  },
  async (message) => {
    if (message.reply_message === false)
      return await message.sendMessage("*Need Photo!*");
    await message.sendMessage("```Editing..```");
    var location = await message.reply_message.downloadMediaMessage();

    ffmpeg(location)
      .outputOptions([
        "-y",
        "-vf",
        "eq=contrast=1.3:saturation=1.5:brightness=-0.1",
      ])
      .save("output.jpg")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("output.jpg"), {}, "image");
      });
  }
);

command(
  {
    pattern: "mp4slowmo",
    fromMe: true,
    desc: "pplies true-slowmo to non-slow motion videos",
    dontAddCommandList: false,
  },
  async (message) => {
    if (!message.reply_message.video)
      return await message.sendMessage("*Need Video!*");
    await message.sendMessage("```Motion Render Interpolating..```");
    var location = await message.reply_message.downloadMediaMessage();

    await message.sendMessage("_This process may take a while.._");

    ffmpeg(location)
      .videoFilters("minterpolate=fps=120")
      .videoFilters("setpts=4*PTS")
      .noAudio()
      .format("mp4")
      .save("slowmo.mp4")
      .on("end", async () => {
        await message.sendMessage(fs.readFileSync("slowmo.mp4"), {}, "video");
      });
  }
);
