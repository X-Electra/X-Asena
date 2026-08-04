/**
 * YouTube download plugin using public stream proxy
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

function pickQuery(message, pattern) {
  const args = getCommandArgs(message.body, pattern);
  if (args) return args.trim();
  if (message.quoted?.text) return String(message.quoted.text).trim();
  return "";
}

async function fetchMediaData(query) {
  // Uses a public proxy endpoint to bypass server IP blocks
  const response = await fetch(`https://api.siputzx.my.id/api/d/youtube?url=${encodeURIComponent(query)}`);
  const json = await response.json();
  if (!json.status || !json.data) {
    throw new Error("Failed to fetch video details. Try using a direct YouTube link.");
  }
  return json.data;
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
        const data = await fetchMediaData(query);
        await reply(
          conn,
          message,
          `🎬 *${data.title || "Unknown"}*\n` +
            `⏱ ${formatDuration(data.duration || 0)}\n` +
            `🔗 ${data.url || query}\n\n` +
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
        const data = await fetchMediaData(query);
        await reply(
          conn,
          message,
          `🎬 *${data.title || "Unknown"}*\n⏱ ${formatDuration(data.duration || 0)}\n🔗 ${data.url || query}`
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
          const data = await fetchMediaData(query);
          const downloadUrl = data.audio || data.dl;
          if (!downloadUrl) throw new Error("Audio download link not found.");
          
          filePath = await downloadUrlToFile(downloadUrl, ".mp3");
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
          const data = await fetchMediaData(query);
          const downloadUrl = data.video || data.dl;
          if (!downloadUrl) throw new Error("Video download link not found.");

          filePath = await downloadUrlToFile(downloadUrl, ".mp4");
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
          const data = await fetchMediaData(query);
          const downloadUrl = data.audio || data.dl;
          if (!downloadUrl) throw new Error("Audio download link not found.");

          await reply(conn, message, `▶️ *${data.title || "Audio"}* · ${formatDuration(data.duration || 0)}`);
          filePath = await downloadUrlToFile(downloadUrl, ".mp3");
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
