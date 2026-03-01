import { Router } from "express";
import {
  getAvailableGoogleModels,
  getAvailableOpenAiModels,
  testAi,
} from "../controllers/aiController";
import { checkAuth } from "../lib/errors";

const aiRouter = Router();

aiRouter.route("/my-google-models").get(checkAuth, getAvailableGoogleModels);
aiRouter.route("/my-openai-models").get(checkAuth, getAvailableOpenAiModels);

export default aiRouter;
