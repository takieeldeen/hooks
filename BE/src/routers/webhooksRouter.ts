import { Router } from "express";
import {
  googleFormWebhook,
  stripeWebhook,
} from "../controllers/webhooksController";

const WebhooksRouter = Router();

WebhooksRouter.post("/google-form-trigger", googleFormWebhook);
WebhooksRouter.post("/stripe-trigger", stripeWebhook);

export default WebhooksRouter;
