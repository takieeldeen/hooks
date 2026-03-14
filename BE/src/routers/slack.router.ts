import { Router } from "express";
import { checkAuth } from "../lib/errors";

import {
  getSlackChannels,
  slackCallback,
  slackEventHandler,
} from "../controllers/slack.controller";

const slackRouter = Router();
// Slack Routes
slackRouter.get("/callback", slackCallback);
slackRouter.post("/events", slackEventHandler);
slackRouter.get("/channels", checkAuth, getSlackChannels);

export default slackRouter;
