import DiscordService from "../integrations/discord.service";
import { catchAsync } from "../lib/errors";
import appConnectionService from "../srv/appConnectionsService";
import { prisma } from "../lib/prisma";

export const discordCallback = catchAsync(async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    throw new Error("Discord authorization code missing");
  }

  const tokenData = await DiscordService.exchangeDiscordCode(code as string);
  const discordUser = await DiscordService.getDiscordUser(
    tokenData.access_token,
  );

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

export const getDiscordServers = catchAsync(async (req, res) => {
  const { connectionId } = req.params;
  const connection = await prisma.appConnection.findUniqueOrThrow({
    where: {
      id: connectionId as string,
      userId: req?.session?.user?.id!,
    },
  });

  const servers = await DiscordService.getDiscordServers(
    connection.accessToken,
  );

  res.status(200).json({
    status: "success",
    content: servers,
  });
});

export const getDiscordServerChannelsHandler = catchAsync(async (req, res) => {
  const { serverId } = req.params;
  const channels = await DiscordService.getDiscordServerChannels(
    serverId as string,
  );
  res.status(200).json({
    status: "success",
    content: channels,
  });
});

export const installDiscordBot = catchAsync(async (req, res) => {
  const { workflowId } = req.query;
  const userId = req.session?.user.id!;
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId as string,
      userId,
    },
  });
  const inviteUrl = DiscordService.generateBotInvitationUrl(workflow.id);

  res.redirect(inviteUrl);
});
