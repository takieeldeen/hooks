import axios from "axios";
import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";

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
      externalId: data.bot_user_id,
    },
    // userId,
    // type: "DISCORD",
    // accessToken: tokenData.access_token,
    // refreshToken: tokenData.refresh_token,
    // scope: tokenData.scope,
    // expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    // externalId: discordUser.id,
    // externalName: discordUser.username,
  });

  res.redirect(`http://localhost:3000/workflows/${workflowId}`);
});

// Slack
export const slackEventHandler = catchAsync(async (req, res, next) => {
  const challenge = req?.body?.challenge;
  console.log(req.body, "NEW_EVENT");
  res.status(200).json({
    status: "success",
    challenge,
  });
});
