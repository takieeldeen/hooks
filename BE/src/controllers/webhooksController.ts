import { catchAsync } from "../lib/errors";
import WorkflowService from "../srv/workflowsService";
import { AppError } from "./errorController";

export const googleFormWebhook = catchAsync(async (req, res, next) => {
  // const url = new URL(req.url);
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

export const stripeWebhook = catchAsync(async (req, res, next) => {
  // const url = new URL(req.url);
  console.log("WEBHOOK TRIGGERED");
  const { workflowId, secret } = req.query;
  const expectedSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
  const stripeData = {
    eventId: body.id,
    eventType: body.type,
    timestamp: body.livemode,
    livemode: body.livemode,
    raw: body.data?.object,
  };
  const initialData = stripeData.eventId ? { stripe: stripeData } : {};
  await WorkflowService.execute(workflowId as string, initialData);
  res.status(200).json({
    status: "success",
  });
});
