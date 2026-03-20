import axios from "axios";
import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";
import WorkflowService from "../srv/workflowsService";
import SlackService from "../integrations/slack.service";
import { AppError } from "./error.controller";

export const slackCallback = catchAsync(async (req, res) => {
  const { code, state } = req.query;

  const response = await axios.post(
    "https://slack.com/api/oauth.v2.access",
    null,
    {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI!,
      },
    },
  );

  const data = response.data;
  const decoded = JSON.parse(Buffer.from(state as string, "base64").toString());
  const { userId, workflowId } = decoded;

  if (!data.ok) {
    throw new Error(data.error);
  }
  console.log(data);
  await prisma.appConnection.create({
    data: {
      userId,
      type: "SLACK",
      accessToken: data.access_token,
      externalName: data.team.name,
      externalId: data.authed_user.id,
    },
  });

  res.redirect(`http://localhost:3000/workflows/${workflowId}`);
});

// Slack
export const slackEventHandler = catchAsync(async (req, res, next) => {
  const body = req.body;

  // Slack URL verification
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  const event = body.event;

  // Ignore bot messages to prevent loops
  if (event?.bot_id || event?.subtype === "bot_message") {
    return res.sendStatus(200);
  }

  const slackUserId = event?.user;

  const integration = await prisma.appConnection.findFirst({
    where: {
      externalId: slackUserId,
      type: "SLACK",
    },
    include: {
      user: true,
    },
  });

  if (!integration) return res.sendStatus(200);

  const slackTriggerNodes = await prisma.node.findMany({
    where: {
      type: "SLACK_TRIGGER",
      workflow: {
        userId: integration.user.id,
      },
    },
    select: {
      workflowId: true,
      data: true,
    },
  });

  const targetWorkflows = slackTriggerNodes
    .filter((node) => {
      const nodeData = node.data as any;
      return nodeData?.channelId === event?.channel;
    })
    .map((node) => node.workflowId);

  if (targetWorkflows.length > 0) {
    await Promise.allSettled(
      targetWorkflows.map((workflowId) =>
        WorkflowService.execute(workflowId, body, integration.user.id),
      ),
    );
  }

  res.sendStatus(200);
});

export const getSlackChannels = catchAsync(async (req, res, next) => {
  const connection = await prisma.appConnection.findFirst({
    where: {
      userId: req.session?.user.id,
      type: "SLACK",
    },
  });
  if (!connection)
    return next(new AppError(400, "No Active Connection with slack found."));
  const channels = await SlackService.getSlackChannels(connection?.id);
  res.status(200).json({
    status: "succes",
    content: channels,
  });
});
