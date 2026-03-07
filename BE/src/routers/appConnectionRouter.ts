import { Router } from "express";
import { checkAuth } from "../lib/errors";
import {
  discordCallback,
  getConnectionDiscordServers,
  getServerChannels,
  getUserAppConnections,
  initiateConnection,
  installDiscordBot,
} from "../controllers/appConnectionsController";

const appConnectionRouter = Router();
// appConnectionRouter.use(checkAuth);
appConnectionRouter
  .route("/my-connections")
  .get(checkAuth, getUserAppConnections);

appConnectionRouter.get("/:type/connect", checkAuth, initiateConnection);
// Discord Routes
appConnectionRouter.get("/discord/callback", discordCallback);
appConnectionRouter.get("/discord/install-bot", installDiscordBot);
appConnectionRouter.get(
  "/discord/connections/:connectionId/servers",
  checkAuth,
  getConnectionDiscordServers,
);
appConnectionRouter.get(
  "/discord/servers/:serverId/channels",
  checkAuth,
  getServerChannels,
);
export default appConnectionRouter;
