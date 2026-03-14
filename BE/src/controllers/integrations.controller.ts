import { AppConnectionType } from "../generated/prisma/enums";
import DiscordService from "../integrations/discord.service";
import SlackService from "../integrations/slack.service";
import { catchAsync } from "../lib/errors";
import appConnectionService from "../srv/appConnectionsService";

export const getUserIntegrations = catchAsync(async (req, res, next) => {
  const { type } = req.query;
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

export const initiateIntegrations = catchAsync(async (req, res) => {
  const { type } = req.params;
  const { workflowId } = req.query;
  const providerMap = {
    DISCORD: DiscordService.generateDiscordUrl,
    SLACK: SlackService.generateSlackUrl,
  };
  const generateUrl = providerMap[type as keyof typeof providerMap];
  if (!generateUrl) {
    throw new Error("Unsupported connection type");
  }

  const url = generateUrl(workflowId as string, req?.session?.user?.id!);
  console.log(url);
  res.redirect(url);
});
