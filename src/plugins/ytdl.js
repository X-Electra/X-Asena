/**
 * YouTube download plugin with multi-fallback handling
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
  extractYoutubeId,
} from "../utils/media.js";
import { MEDIA, BOT_INFO } from "../config/constants.js";
import { readFile, stat } from "fs/promises";
import { enqueueJob } from "../enterprise/queue.js";
import ytSearch from "yt-search";
import fetch from "node-fetch";

function pickQuery(message, pattern) {
  const args = getCommandArgs(message.body, pattern);
  if (args) return args.trim();
  if (message.quoted?.text) return String(message.quoted.text).trim();
  return "";
}

async function searchVideo(query) {
  const vidId = extractYoutubeId(query);
  if (vidId) {
    const res = await ytSearch({ videoId: vidId });
    if (res && res.title) {
      return { title: res.title, duration: res.seconds, url: res.url, id: res.videoId };
    }
  }
  const searchResults = await ytSearch(query);
  const video = searchResults?.videos?.[0];
  if (!video) throw new Error("No results found on YouTube.");
  return { title: video.title, duration: video.seconds, url: video.url, id: video.videoId };
}

async function fetchStreamUrls(url) {
  // Uses redundant public conversion fallback API endpoints to bypass cloud data-center blocks
  const apis = [
    `https://api.siputzx.my.id/api/d/youtube?url=${encodeURIComponent(url)}`,
    `https://apis.davidcyriltech.my.id/youtube/dl?url=${encodeURIComponent(url)}`
  ];

  for (const api of apis) {
    try {
      const res = await fetch(api);
      const json = await res.json();
      const data = json.data || json.result || json;
      const audioUrl = data.audio || data.dl || data.mp3;
      const videoUrl = data.video || data.dl || data.mp4;
      if (audioUrl || videoUrl) {
        return { audio: audioUrl, video: videoUrl, title: data.title };
      }
    } catch {
      continue;
    }
  }
  throw new Error("All download stream providers are currently busy or blocked. Try again later.");
}

async function downloadUrlToFile(fileUrl, ext) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error("Failed to download media stream data.");
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
      caption: `🎬 *${meta.title}*\n⏱ ${formatDuration(meta.duration || 0)}\n${meta.url}`,
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
        const meta = await searchVideo(query);
        await reply(
          conn,
          message,
          `🎬 *${meta.title}*\n` +
            `⏱ ${formatDuration(meta.duration || 0)}\n` +
            `🔗 ${meta.url}\n\n` +
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
        const meta = await searchVideo(query);
        await reply(
          conn,
          message,
          `🎬 *${meta.title}*\n⏱ ${formatDuration(meta.duration || 0)}\n🔗 ${meta.url}`
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
          const meta = await searchVideo(query);
          const streams = await fetchStreamUrls(meta.url);
          const targetUrl = streams.audio || streams.video;
          if (!targetUrl) throw new Error("Audio stream unavailable.");
          
          filePath = await downloadUrlToFile(targetUrl, ".mp3");
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
          const meta = await searchVideo(query);
          const streams = await fetchStreamUrls(meta.url);
          const targetUrl = streams.video || streams.audio;
          if (!targetUrl) throw new Error("Video stream unavailable.");

          filePath = await downloadUrlToFile(targetUrl, ".mp4");
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
          const meta = await searchVideo(query);
          await reply(conn, message, `▶️ *${meta.title}* · ${formatDuration(meta.duration || 0)}`);
          const streams = await fetchStreamUrls(meta.url);
          const targetUrl = streams.audio || streams.video;
          if (!targetUrl) throw new Error("Audio stream unavailable.");

          filePath = await downloadUrlToFile(targetUrl, ".mp3");
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
