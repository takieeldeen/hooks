import { Router } from "express";
import { checkAuth } from "../lib/errors";
import {
  discordCallback,
  getConnectionDiscordServers,
  getUserAppConnections,
  initiateConnection,
} from "../controllers/appConnectionsController";
import { getDiscordServerChannels } from "../integrations/discord";

const appConnectionRouter = Router();
// appConnectionRouter.use(checkAuth);
appConnectionRouter
  .route("/my-connections")
  .get(checkAuth, getUserAppConnections);

appConnectionRouter.get("/:type/connect", checkAuth, initiateConnection);
// Discord Routes
appConnectionRouter.get("/discord/callback", discordCallback);
appConnectionRouter.get(
  "/discord/connections/:connectionId/servers",
  checkAuth,
  getConnectionDiscordServers,
);
appConnectionRouter.get(
  "/discord/servers/:serverId/channels",
  checkAuth,
  getDiscordServerChannels,
);
export default appConnectionRouter;
