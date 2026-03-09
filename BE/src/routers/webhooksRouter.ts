import { Router } from "express";
import { googleFormWebhook } from "../controllers/google.controller";

const WebhooksRouter = Router();

WebhooksRouter.post("/google-form-trigger", googleFormWebhook);

export default WebhooksRouter;
