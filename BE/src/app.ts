import express, { json } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import aiRouter from "./routers/aiRouter";
import { paymentRouter } from "./routers/paymentRouter";
import ErrorController from "./controllers/error.controller";
import { workflowRouter } from "./routers/workflowRouter";
import { credentialsRouter } from "./routers/credentialsRouter";
import WebhooksRouter from "./routers/webhooksRouter";
import morgan from "morgan";
import appConnectionRouter from "./routers/appConnectionRouter";
import slackRouter from "./routers/slack.router";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URI!,
    credentials: true,
  }),
);

// cron.schedule("* * * * *",task)
app.use(json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.status(200).json({
    content: process.env.DATABASE_URL,
  });
});

app.use("/api/app-connections", appConnectionRouter);
app.use("/api/slack", slackRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/credentials", credentialsRouter);
app.use("/api/workflows", workflowRouter);
app.use("/api/webhooks", WebhooksRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/ai", aiRouter);
app.use(ErrorController);

export default app;
