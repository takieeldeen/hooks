import axios from "axios";
import { prisma } from "../lib/prisma";

const generateSlackUrl = (workflowId: string, userId: string) => {
  const state = Buffer.from(JSON.stringify({ userId, workflowId })).toString(
    "base64",
  );
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: [
      "chat:write",
      "channels:read",
      "channels:history",
      "groups:read",
      "groups:history",
      "im:read",
      "im:history",
      "users:read",
    ].join(","),
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
    state,
  });
  const url = `https://slack.com/oauth/v2/authorize?${params}`;
  return url;
};

const getSlackChannels = async (connectionId: string) => {
  const connection = await prisma.appConnection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) throw new Error("Slack connection not found");

  const res = await axios.get("https://slack.com/api/conversations.list", {
    params: {
      types: "public_channel,private_channel",
    },
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
    },
  });

  return res.data.channels;
};

const sendSlackMessage = async (
  userId: string,
  channelId: string,
  message: string,
) => {
  const connection = await prisma.appConnection.findFirst({
    where: {
      userId,
      type: "SLACK",
    },
  });
  await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: channelId,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${connection?.accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
};

const SlackService = {
  generateSlackUrl,
  getSlackChannels,
  sendSlackMessage,
};

export default SlackService;
