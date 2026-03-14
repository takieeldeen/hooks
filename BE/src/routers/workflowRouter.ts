import { Router } from "express";
import { checkAuth } from "../lib/errors";
import {
  createWorkflow,
  getWorkflows,
  deleteWorkflow,
  getWorkflow,
  updateWorkflow,
  updateWorkflowName,
  executeWorkflow,
} from "../controllers/workflow.controller";
import { getAllExecutions } from "../controllers/execution.controller";

export const workflowRouter = Router();

workflowRouter.use(checkAuth);
workflowRouter.route("/").get(getWorkflows).post(createWorkflow);
workflowRouter
  .route("/:workflowId")
  .delete(deleteWorkflow)
  .get(getWorkflow)
  .patch(updateWorkflow);

workflowRouter.route("/:workflowId/name").patch(updateWorkflowName);
workflowRouter.post("/:workflowId/execute", executeWorkflow);

workflowRouter.get("/:workflowId/executions", getAllExecutions);
