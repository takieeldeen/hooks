import { catchAsync } from "../lib/errors";
import WorkflowExecutionService from "../srv/execution.service";

export const getAllExecutions = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const executions = await WorkflowExecutionService.getAll(
    workflowId as string,
    req.session?.user.id,
  );
  res.status(200).json({
    content: executions ?? [],
    results: executions?.length ?? 0,
    status: "success",
  });
});
