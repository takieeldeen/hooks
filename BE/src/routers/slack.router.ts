import { Router } from "express";
import { checkAuth } from "../lib/errors";

import {
  slackCallback,
  slackEventHandler,
} from "../controllers/slack.controller";

const slackRouter = Router();
// Slack Routes
slackRouter.get("/callback", slackCallback);
slackRouter.post("/events", slackEventHandler);

export default slackRouter;
