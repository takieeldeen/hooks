import { Router } from "express";
import { checkAuth } from "../lib/errors";
import {
  getUserIntegrations,
  initiateIntegrations,
} from "../controllers/integrations.controller";
import {
  discordCallback,
  getDiscordServerChannelsHandler,
  getDiscordServers,
  installDiscordBot,
} from "../controllers/discord.controller";

const appConnectionRouter = Router();
appConnectionRouter
  .route("/my-connections")
  .get(checkAuth, getUserIntegrations);

appConnectionRouter.get("/:type/connect", checkAuth, initiateIntegrations);
// Discord Routes
appConnectionRouter.get("/discord/callback", discordCallback);
appConnectionRouter.get("/discord/install-bot", installDiscordBot);
appConnectionRouter.get(
  "/discord/connections/:connectionId/servers",
  checkAuth,
  getDiscordServers,
);
appConnectionRouter.get(
  "/discord/servers/:serverId/channels",
  checkAuth,
  getDiscordServerChannelsHandler,
);

export default appConnectionRouter;
