import { Router } from "express";
import { checkAuth } from "../lib/errors";
import {
  createWorkflow,
  getWorkflows,
  deleteWorkflow,
  getWorkflow,
  updateWorkflow,
} from "../controllers/workflowController";

export const workflowRouter = Router();

workflowRouter.use(checkAuth);
workflowRouter.route("/").get(getWorkflows).post(createWorkflow);
workflowRouter
  .route("/:workflowId")
  .delete(deleteWorkflow)
  .get(getWorkflow)
  .patch(updateWorkflow);
