import { Client, GatewayIntentBits, Events } from "discord.js";
import axios from "axios";
import { prisma } from "../lib/prisma";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`[Discord Bot] Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots (including itself)
  if (message.author.bot) return;
  console.log("USER SENT A MESSAGE");

  const channelId = message.channelId;
  const serverId = message.guildId;

  if (!serverId) return; // DMs not supported

  // Find all DISCORD_TRIGGER nodes and match by channelId / serverId
  const triggerNodes = await prisma.node.findMany({
    where: { type: "DISCORD_TRIGGER" },
    select: { workflowId: true, data: true },
  });

  // Filter nodes whose configured channelId/serverId match this message
  const matchingWorkflowIds = triggerNodes
    .filter((node) => {
      const data = node.data as {
        channelId?: string;
        serverId?: string;
      };

      // If the node has a serverId configured, it must match
      if (data.serverId && data.serverId !== serverId) return false;
      // If the node has a channelId configured, it must match
      if (data.channelId && data.channelId !== channelId) return false;

      return true;
    })
    .map((node) => node.workflowId);

  if (matchingWorkflowIds.length === 0) return;

  const payload = {
    messageId: message.id,
    content: message.content,
    authorId: message.author.id,
    authorName: message.author.username,
    channelId,
    serverId,
    timestamp: message.createdAt.toISOString(),
  };

  const internalBaseUrl =
    process.env.BE_URI ?? `http://localhost:${process.env.PORT ?? "9001"}`;
  const secret = process.env.DISCORD_WEBHOOK_SECRET;

  // Fire all matching workflows concurrently
  await Promise.allSettled(
    matchingWorkflowIds.map((workflowId) =>
      axios
        .post(
          `${internalBaseUrl}/api/webhooks/discord-trigger?workflowId=${workflowId}&secret=${secret}`,
          payload,
        )
        .catch((err) =>
          console.error(
            `[Discord Bot] Failed to trigger workflow ${workflowId}:`,
            err?.response?.data ?? err.message,
          ),
        ),
    ),
  );
});

export const startDiscordBot = () => {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.warn(
      "[Discord Bot] DISCORD_BOT_TOKEN not set — bot will not start",
    );
    return;
  }
  client.login(token);
};
