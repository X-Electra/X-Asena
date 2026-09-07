import { command } from "../plugins.js";
import { isOwnerMessage } from "../utils/access.js";

command(
  {
    pattern: "status",
    desc: "Show bot status",
    type: "owner",
    fromMe: true,
  },
  async (message) => {
    await message.send("✅ Bot is online and working.");
  }
);

command(
  {
    pattern: "block",
    desc: "Block a user",
    type: "owner",
    fromMe: true,
  },
  async (message) => {
    if (!isOwnerMessage(message)) {
      return await message.send("❌ Owner only.");
    }

    const jid = message.quoted?.sender || message.mention?.[0];

    if (!jid) {
      return await message.send(
        "❌ Reply to a user's message or mention the user."
      );
    }

    await message.client.updateBlockStatus(jid, "block");
    await message.send("✅ User blocked.");
  }
);

command(
  {
    pattern: "unblock",
    desc: "Unblock a user",
    type: "owner",
    fromMe: true,
  },
  async (message) => {
    if (!isOwnerMessage(message)) {
      return await message.send("❌ Owner only.");
    }

    const jid = message.quoted?.sender || message.mention?.[0];

    if (!jid) {
      return await message.send(
        "❌ Reply to a user's message or mention the user."
      );
    }

    await message.client.updateBlockStatus(jid, "unblock");
    await message.send("✅ User unblocked.");
  }
);
