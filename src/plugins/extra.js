import { command } from "../plugins.js";

const ownerOnly = {
  fromMe: true,
  type: "owner",
};

// STATUS
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

// BLOCK
command(
  {
    pattern: "block",
    desc: "Block a user",
    type: "owner",
    fromMe: true,
  },
  async (message) => {
    const jid = message.quoted?.sender || message.mention?.[0];

    if (!jid) {
      return await message.send("❌ Reply to a user's message or mention the user.");
    }

    await message.client.updateBlockStatus(jid, "block");
    await message.send("✅ User blocked.");
  }
);

// UNBLOCK
command(
  {
    pattern: "unblock",
    desc: "Unblock a user",
    type: "owner",
    fromMe: true,
  },
  async (message) => {
    const jid = message.quoted?.sender || message.mention?.[0];

    if (!jid) {
      return await message.send("❌ Reply to a user's message or mention the user.");
    }

    await message.client.updateBlockStatus(jid, "unblock");
    await message.send("✅ User unblocked.");
  }
);
