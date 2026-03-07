import axios from "axios";
import { AppError } from "../controllers/errorController";

export const generateDiscordUrl = (workflowId: string, userId: string) => {
  const state = Buffer.from(JSON.stringify({ userId, workflowId })).toString(
    "base64",
  );
  console.log(state, userId, "STATTTTTTE");
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    scope: "identify guilds",
    state,
  });

  return `https://discord.com/api/oauth2/authorize?${params}`;
};

export const exchangeDiscordCode = async (code: string) => {
  try {
    const body = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    });

    const response = await axios.post(
      process.env.DISCORD_TOKEN_EXCHANGE_URI!,
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    if (!response) {
      throw new AppError(400, "Failed to exchange Discord OAuth code");
    }
    return response.data;
  } catch (err: any) {
    throw new AppError(400, err?.response?.data);
  }
};

export const getDiscordUser = async (accessToken: string) => {
  const response = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response) {
    throw new Error("Failed to fetch Discord user");
  }

  return response.data;
};

export const getDiscordServers = async (accessToken: string) => {
  try {
    const userServers = await axios.get(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const botServers = await axios.get(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );
    const botServerIds = new Set(botServers.data.map((g: any) => g.id));

    return userServers.data.map((guild: any) => ({
      ...guild,
      botInstalled: botServerIds.has(guild.id),
    }));
  } catch (err: any) {
    throw new AppError(400, err?.response?.data);
  }
};
export const getDiscordServerChannels = async (serverId: string) => {
  try {
    console.log(serverId);
    const response = await axios.get(
      `https://discord.com/api/guilds/${serverId}/channels`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );
    const textChannels = response.data.filter(
      (channel: any) => channel.type === 0,
    );
    return textChannels;
  } catch (err: any) {
    console.log("We HAVE AN ERROR");
    throw new AppError(400, err?.response?.data);
  }
};

export const generateBotInvitationUrl = (workflowId: string) => {
  const state = Buffer.from(JSON.stringify({ workflowId })).toString("base64");
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    scope: "bot",
    permissions: "3072",
    // redirect_uri: `${process.env.CLIENT_URI}/workflows/${workflowId}`,
    state,
  });

  const inviteUrl = `https://discord.com/oauth2/authorize?${params}`;

  return inviteUrl;
};

export const sendDiscordMessage = async (
  channelId: string,
  message: string,
) => {
  try {
    const response = await axios.post(
      `https://discord.com/api/channels/${channelId}/messages`,
      {
        content: message,
      },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    return response.data;
  } catch (err: any) {
    throw new AppError(400, err?.response?.data);
  }
};
