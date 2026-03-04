import express, { json } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import aiRouter from "./routers/aiRouter";
import { paymentRouter } from "./routers/paymentRouter";
import ErrorController from "./controllers/errorController";
import { workflowRouter } from "./routers/workflowRouter";
import { credentialsRouter } from "./routers/credentialsRouter";
import WebhooksRouter from "./routers/webhooksRouter";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
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

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/webhooks", WebhooksRouter);
app.use("/api/workflows", workflowRouter);
app.use("/api/credentials", credentialsRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/ai", aiRouter);
app.use(ErrorController);

export default app;
