/**
 * YouTube Native Plugin (Fixed Decipher & Socket-Safe Transmission)
 * #yt #ytmp3 #ytmp4 #play
 */

import { command } from "../plugins.js";
import {
  reply,
  replyFail,
  withTyping,
  getCommandArgs,
} from "../utils/message.js";
import {
  createTempPath,
  safeUnlink,
  streamToFile,
  assertAudioSize,
  assertVideoSize,
  ffmpegConvert,
  formatDuration,
  extractYoutubeId,
} from "../utils/media.js";
import { MEDIA, BOT_INFO } from "../config/constants.js";
import { readFile, stat } from "fs/promises";
import { enqueueJob } from "../enterprise/queue.js";

let ytClient = null;

async function getYt() {
  if (ytClient) return ytClient;
  const { Innertube } = await import("youtubei.js");
  
  // Forced client types and cookie authentication to prevent decipher/login blocks
  ytClient = await Innertube.create({
    cookie: process.env.YOUTUBE_COOKIE || undefined,
    generate_session_locally: true,
    client_type: "WEB"
  });
  return ytClient;
}

function pickQuery(message, pattern) {
  const args = getCommandArgs(message.body, pattern);
  if (args) return args.trim();
  if (message.quoted?.text) return String(message.quoted.text).trim();
  return "";
}

async function resolveVideo(query) {
  const yt = await getYt();
  const id = extractYoutubeId(query);
  if (id) {
    const info = await yt.getBasicInfo(id);
    return { id, info, yt };
  }

  const search = await yt.search(query, { type: "video" });
  const first =
    search.videos?.[0] ||
    search.results?.find((r) => r?.id) ||
    null;
  const resolvedId = first?.id;

  if (!resolvedId) {
    throw new Error("No results found.");
  }

  const info = await yt.getBasicInfo(resolvedId);
  return { id: resolvedId, info, yt };
}

function videoMeta(info) {
  const b = info?.basic_info || {};
  return {
    title: b.title || "Unknown",
    duration: b.duration || 0,
    author: b.author || b.channel?.name || "Unknown",
    url: b.url_canonical || `https://youtu.be/${b.id || ""}`,
    id: b.id,
  };
}

async function downloadToFile(yt, videoId, options, ext) {
  try {
    const stream = await yt.download(videoId, {
      ...options,
      client: "WEB"
    });
    const filePath = createTempPath(ext);
    await streamToFile(stream, filePath);
    return filePath;
  } catch (error) {
    if (error.message.includes("login") || error.message.includes("sign in")) {
      throw new Error("❌ YouTube blocked the bot! Ensure your YOUTUBE_COOKIE is valid in your Koyeb environment variables.");
    }
    if (error.message.includes("decipher") || error.message.includes("signature")) {
      throw new Error("❌ YouTube signature update error. Try updating your 'youtubei.js' package version in package.json.");
    }
    throw error;
  }
}

async function sendAudioFile(conn, message, filePath, meta) {
  const st = await stat(filePath);
  assertAudioSize(st.size);
  const buf = await readFile(filePath);
  
  // Safe retry loop to prevent connection 408 socket drops during upload
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await conn.sendMessage(
        message.from,
        {
          audio: buf,
          mimetype: "audio/mpeg",
          fileName: `${(meta.title || "audio").slice(0, 60)}.mp3`,
          ptt: false,
        },
        { quoted: { key: message.key, message: message.message } }
      );
      return;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

async function sendVideoFile(conn, message, filePath, meta) {
  const st = await stat(filePath);
  assertVideoSize(st.size);
  const buf = await readFile(filePath);
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await conn.sendMessage(
        message.from,
        {
          video: buf,
          caption: `🎬 *${meta.title}*\n⏱ ${formatDuration(meta.duration)}\n${meta.url}`,
          fileName: `${(meta.title || "video").slice(0, 60)}.mp4`,
          mimetype: "video/mp4",
        },
        { quoted: { key: message.key, message: message.message } }
      );
      return;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

async function fetchAudioMp3(yt, videoId, duration) {
  if (duration && duration > MEDIA.MAX_AUDIO_DURATION) {
    throw new Error(`Audio too long (max ${MEDIA.MAX_AUDIO_DURATION / 60} min).`);
  }

  const rawPath = await downloadToFile(
    yt,
    videoId,
    { type: "audio", quality: "best", format: "any" },
    ".audio"
  );
  const mp3Path = createTempPath(".mp3");
  try {
    await ffmpegConvert(rawPath, mp3Path, (cmd) =>
      cmd.noVideo().audioCodec("libmp3lame").audioBitrate("128k").format("mp3")
    );
    await safeUnlink(rawPath);
    return mp3Path;
  } catch (err) {
    await safeUnlink(rawPath);
    await safeUnlink(mp3Path);
    throw new Error("FFmpeg failed converting audio.");
  }
}

async function fetchVideoMp4(yt, videoId, duration) {
  if (duration && duration > MEDIA.MAX_VIDEO_DURATION) {
    throw new Error(`Video too long (max ${MEDIA.MAX_VIDEO_DURATION / 60} min).`);
  }

  return downloadToFile(
    yt,
    videoId,
    {
      type: "video+audio",
      quality: "720p",
      format: "mp4",
    },
    ".mp4"
  );
}

command(
  {
    pattern: "yt",
    fromMe: false,
    desc: "YouTube info / usage",
    type: "media",
  },
  async (message, conn) => {
    const query = pickQuery(message, "yt");
    if (!query) {
      await reply(
        conn,
        message,
        `*YouTube*\n` +
          `\`${BOT_INFO.PREFIX}yt <url|query>\` — info\n` +
          `\`${BOT_INFO.PREFIX}ytmp3 <url|query>\` — audio\n` +
          `\`${BOT_INFO.PREFIX}ytmp4 <url|query>\` — video ≤720p\n` +
          `\`${BOT_INFO.PREFIX}play <query>\` — search → audio\n\n` +
          `_Caps: ~${MEDIA.MAX_AUDIO_DURATION / 60}min audio / ~${MEDIA.MAX_VIDEO_DURATION / 60}min video._`
      );
      return;
    }

    await withTyping(conn, message.from, async () => {
      try {
        const { info } = await resolveVideo(query);
        const meta = videoMeta(info);
        await reply(
          conn,
          message,
          `🎬 *${meta.title}*\n👤 ${meta.author}\n⏱ ${formatDuration(meta.duration)}\n🔗 ${meta.url}\n\nUse \`${BOT_INFO.PREFIX}ytmp3\` / \`${BOT_INFO.PREFIX}ytmp4\` to download.`
        );
      } catch (err) {
        await replyFail(conn, message, err?.message || "YouTube lookup failed.");
      }
    }, { timeoutMs: 45_000 });
  }
);

command(
  {
    pattern: "ytdl",
    fromMe: false,
    desc: "Alias for yt",
    type: "media",
    dontAddCommandList: true,
  },
  async (message, conn) => {
    const query = pickQuery(message, "ytdl");
    if (!query) {
      await replyFail(conn, message, `Usage: \`${BOT_INFO.PREFIX}ytdl <url|query>\``);
      return;
    }
    await withTyping(conn, message.from, async () => {
      try {
        const { info } = await resolveVideo(query);
        const meta = videoMeta(info);
        await reply(conn, message, `🎬 *${meta.title}*\n⏱ ${formatDuration(meta.duration)}\n🔗 ${meta.url}`);
      } catch (err) {
        await replyFail(conn, message, err?.message || "YouTube lookup failed.");
      }
    }, { timeoutMs: 45_000 });
  }
);

command(
  {
    pattern: "ytmp3",
    fromMe: false,
    desc: "Download YouTube audio (mp3)",
    type: "media",
  },
  async (message, conn) => {
    const query = pickQuery(message, "ytmp3");
    if (!query) {
      await replyFail(conn, message, `Usage: \`${BOT_INFO.PREFIX}ytmp3 <url|query>\``);
      return;
    }
    await withTyping(conn, message.from, async () => {
      await enqueueJob("ytmp3", async () => {
        let filePath;
        try {
          const { id, info, yt } = await resolveVideo(query);
          const meta = videoMeta(info);
          filePath = await fetchAudioMp3(yt, id, meta.duration);
          await sendAudioFile(conn, message, filePath, meta);
        } catch (err) {
          await replyFail(conn, message, err?.message || "ytmp3 failed.");
        } finally {
          await safeUnlink(filePath);
        }
      });
    }, { timeoutMs: 180_000 });
  }
);

command(
  {
    pattern: "ytmp4",
    fromMe: false,
    desc: "Download YouTube video ≤720p",
    type: "media",
  },
  async (message, conn) => {
    const query = pickQuery(message, "ytmp4");
    if (!query) {
      await replyFail(conn, message, `Usage: \`${BOT_INFO.PREFIX}ytmp4 <url|query>\``);
      return;
    }
    await withTyping(conn, message.from, async () => {
      await enqueueJob("ytmp4", async () => {
        let filePath;
        try {
          const { id, info, yt } = await resolveVideo(query);
          const meta = videoMeta(info);
          filePath = await fetchVideoMp4(yt, id, meta.duration);
          await sendVideoFile(conn, message, filePath, meta);
        } catch (err) {
          await replyFail(conn, message, err?.message || "ytmp4 failed.");
        } finally {
          await safeUnlink(filePath);
        }
      });
    }, { timeoutMs: 240_000 });
  }
);

command(
  {
    pattern: "play",
    fromMe: false,
    desc: "Search YouTube and play first audio",
    type: "media",
  },
  async (message, conn) => {
    const query = pickQuery(message, "play");
    if (!query) {
      await replyFail(conn, message, `Usage: \`${BOT_INFO.PREFIX}play <query>\``);
      return;
    }
    await withTyping(conn, message.from, async () => {
      await enqueueJob("play", async () => {
        let filePath;
        try {
          const { id, info, yt } = await resolveVideo(query);
          const meta = videoMeta(info);
          await reply(conn, message, `▶️ *${meta.title}* · ${formatDuration(meta.duration)}`);
          filePath = await fetchAudioMp3(yt, id, meta.duration);
          await sendAudioFile(conn, message, filePath, meta);
        } catch (err) {
          await replyFail(conn, message, err?.message || "play failed.");
        } finally {
          await safeUnlink(filePath);
        }
      });
    }, { timeoutMs: 180_000 });
  }
);
