import { Router } from "express";
import {
  googleFormWebhook,
  stripeWebhook,
  discordTriggerWebhook,
} from "../controllers/webhooksController";

const WebhooksRouter = Router();

WebhooksRouter.post("/google-form-trigger", googleFormWebhook);
WebhooksRouter.post("/stripe-trigger", stripeWebhook);
WebhooksRouter.post("/discord-trigger", discordTriggerWebhook);

export default WebhooksRouter;
