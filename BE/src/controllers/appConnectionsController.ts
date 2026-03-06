import axios from "axios";
import { AppConnectionType } from "../generated/prisma/enums";
import {
  exchangeDiscordCode,
  generateDiscordUrl,
  getDiscordServerChannels,
  getDiscordServers,
  getDiscordUser,
} from "../integrations/discord";
import { catchAsync } from "../lib/errors";
import appConnectionService from "../srv/appConnectionsService";
import { prisma } from "../lib/prisma";

export const getUserAppConnections = catchAsync(async (req, res, next) => {
  const { type } = req.params;
  const userId = req.session?.user.id!;
  const userConnections = await appConnectionService.getUserConnections(
    userId,
    type as AppConnectionType | undefined,
  );
  res.status(200).json({
    status: "success",
    content: userConnections,
  });
});

export const initiateConnection = catchAsync(async (req, res) => {
  const { type } = req.params;
  const { workflowId } = req.query;

  const providerMap = {
    DISCORD: generateDiscordUrl,
  };
  const generateUrl = providerMap[type as keyof typeof providerMap];
  if (!generateUrl) {
    throw new Error("Unsupported connection type");
  }

  const url = generateUrl(workflowId as string, req?.session?.user?.id!);

  res.redirect(url);
});

export const discordCallback = catchAsync(async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    throw new Error("Discord authorization code missing");
  }

  const tokenData = await exchangeDiscordCode(code as string);
  const discordUser = await getDiscordUser(tokenData.access_token);

  const decoded = JSON.parse(Buffer.from(state as string, "base64").toString());

  const { userId, workflowId } = decoded;
  await appConnectionService.create({
    userId,
    type: "DISCORD",
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    scope: tokenData.scope,
    expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    externalId: discordUser.id,
    externalName: discordUser.username,
  });

  res.redirect(`http://localhost:3000/workflows/${workflowId}`);
});

export const getConnectionDiscordServers = catchAsync(async (req, res) => {
  const { connectionId } = req.params;
  const connection = await prisma.appConnection.findUniqueOrThrow({
    where: {
      id: connectionId as string,
      userId: req?.session?.user?.id!,
    },
  });

  const servers = await getDiscordServers(connection.accessToken);

  res.status(200).json({
    status: "success",
    content: servers,
  });
});

export const getServerChannels = catchAsync(async (req, res) => {
  const { serverId } = req.params;
  const channels = await getDiscordServerChannels(serverId as string);
  res.status(200).json({
    status: "success",
    content: channels,
  });
});
