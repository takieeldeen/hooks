import { catchAsync } from "../lib/errors";
import WorkflowService from "../srv/workflowsService";
import { AppError } from "./error.controller";

export const googleFormWebhook = catchAsync(async (req, res, next) => {
  const { workflowId, secret } = req.query;
  const expectedSecret = process.env.GOOGLE_FORM_WEBHOOK_SECRET;
  const providedSecret = secret;
  if (expectedSecret !== providedSecret)
    return res.status(401).json({
      status: "success",
      message: "UNAUTHORIZED",
    });
  if (!workflowId)
    return next(
      new AppError(400, "Missing required query parameter: workflowId"),
    );
  const body = req.body ?? {};
  const formData = {
    formId: body.formId,
    formTitle: body.formTitle,
    responseId: body.responseId,
    timestamp: body.timestamp,
    respondentEmail: body.respondentEmail,
    responses: body.responses,
    raw: body,
  };
  const initialData = formData.formId ? { googleForm: formData } : {};
  await WorkflowService.execute(workflowId as string, initialData);
  res.status(200).json({
    status: "success",
  });
});
