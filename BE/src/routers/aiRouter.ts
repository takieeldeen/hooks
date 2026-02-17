import { Router } from "express";
import { testAi } from "../controllers/aiController";
import { checkAuth } from "../lib/errors";

const aiRouter = Router();

aiRouter.route('/test').get(checkAuth,testAi)

export default aiRouter;