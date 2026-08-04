/**
 * YouTube Ultimate Hybrid Plugin (Native Search + Multi-Server API + Cookie Support)
 * Bypasses Koyeb IP blocks safely
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
  formatDuration,
} from "../utils/media.js";
import { MEDIA, BOT_INFO } from "../config/constants.js";
import { readFile, stat } from "fs/promises";
import { enqueueJob } from "../enterprise/queue.js";

let ytClient = null;

async function getYt() {
  if (ytClient) return ytClient;
  const { Innertube } = await import("youtubei.js");
  // Safely passes your browser cookie if you added it to Koyeb
  ytClient = await Innertube.create({
    cookie: process.env.YOUTUBE_COOKIE || undefined,
  });
  return ytClient;
}

function pickQuery(message, pattern) {
  const args = getCommandArgs(message.body, pattern);
  if (args) return args.trim();
  if (message.quoted?.text) return String(message.quoted.text).trim();
  return "";
}

async function resolveQueryToUrl(query) {
  let targetUrl = query;
  let meta = { title: "YouTube Video", duration: 0 };

  if (!/youtu\.be|youtube\.com/i.test(query)) {
    const yt = await getYt();
    const search = await yt.search(query, { type: "video" });
    const first = search.videos?.[0];
    
    if (!first?.id) throw new Error("Could not find any video for that search.");
    
    targetUrl = `https://youtu.be/${first.id}`;
    meta.title = first.title?.text || first.title || "Unknown";
    meta.duration = first.duration?.seconds || 0;
  }
  return { targetUrl, meta };
}

async function fetchMediaData(query, type = "audio") {
  const { targetUrl, meta } = await resolveQueryToUrl(query);
  let downloadUrl = null;

  // 1st Attempt: Siputzx Server
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/youtube?url=${encodeURIComponent(targetUrl)}`);
    const json = await res.json();
    if (json.status && json.data) {
      downloadUrl = type === "audio" ? (json.data.audio || json.data.dl) : (json.data.video || json.data.dl);
    }
  } catch (err) {}

  // 2nd Attempt: Vreden Server (Fallback)
  if (!downloadUrl) {
    try {
      const ep = type === "audio" ? "ytmp3" : "ytmp4";
      const res = await fetch(`https://api.vreden.my.id/api/${ep}?url=${encodeURIComponent(targetUrl)}`);
      const json = await res.json();
      if (json.result && json.result.download) downloadUrl = json.result.download;
    } catch (err) {}
  }

  // 3rd Attempt: David Cyril Server (Fallback 2)
  if (!downloadUrl) {
    try {
      const ep = type === "audio" ? "mp3" : "mp4";
      const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/${ep}?url=${encodeURIComponent(targetUrl)}`);
      const json = await res.json();
      if (json.result && json.result.download_url) downloadUrl = json.result.download_url;
    } catch (err) {}
  }

  if (!downloadUrl) {
    throw new Error("All download servers are currently busy or offline. Please try again later.");
  }

  return {
    url: targetUrl,
    title: meta.title,
    duration: meta.duration,
    dlUrl: downloadUrl
  };
}

async function downloadUrlToFile(fileUrl, ext) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error("Failed to download media stream.");
  const filePath = createTempPath(ext);
  await streamToFile(res.body, filePath);
  return filePath;
}

async function sendAudioFile(conn, message, filePath, meta) {
  const st = await stat(filePath);
  assertAudioSize(st.size);
  const buf = await readFile(filePath);
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
}

async function sendVideoFile(conn, message, filePath, meta) {
  const st = await stat(filePath);
  assertVideoSize(st.size);
  const buf = await readFile(filePath);
  await conn.sendMessage(
    message.from,
    {
      video: buf,
      caption: `🎬 *${meta.title}*\n⏱ ${formatDuration(meta.duration || 0)}\n${meta.url || ""}`,
      fileName: `${(meta.title || "video").slice(0, 60)}.mp4`,
      mimetype: "video/mp4",
    },
    { quoted: { key: message.key, message: message.message } }
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
        const data = await fetchMediaData(query, "audio");
        await reply(
          conn,
          message,
          `🎬 *${data.title}*\n` +
            `⏱ ${formatDuration(data.duration)}\n` +
            `🔗 ${data.url}\n\n` +
            `Use \`${BOT_INFO.PREFIX}ytmp3\` / \`${BOT_INFO.PREFIX}ytmp4\` to download.`
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
        const data = await fetchMediaData(query, "audio");
        await reply(
          conn,
          message,
          `🎬 *${data.title}*\n⏱ ${formatDuration(data.duration)}\n🔗 ${data.url}`
        );
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
          const data = await fetchMediaData(query, "audio");
          filePath = await downloadUrlToFile(data.dlUrl, ".mp3");
          await sendAudioFile(conn, message, filePath, data);
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
          const data = await fetchMediaData(query, "video");
          filePath = await downloadUrlToFile(data.dlUrl, ".mp4");
          await sendVideoFile(conn, message, filePath, data);
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
          const data = await fetchMediaData(query, "audio");
          await reply(conn, message, `▶️ *${data.title}* · ${formatDuration(data.duration)}`);
          filePath = await downloadUrlToFile(data.dlUrl, ".mp3");
          await sendAudioFile(conn, message, filePath, data);
        } catch (err) {
          await replyFail(conn, message, err?.message || "play failed.");
        } finally {
          await safeUnlink(filePath);
        }
      });
    }, { timeoutMs: 180_000 });
  }
);
