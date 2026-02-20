import express, { json } from "express";
import { testFn } from "./controllers/test";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { checkAuth } from "./lib/errors";
import aiRouter from "./routers/aiRouter";
import { paymentRouter } from "./routers/paymentRouter";
import ErrorController from "./controllers/errorController";
import { workflowRouter } from "./routers/workflowRouter";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// cron.schedule("* * * * *",task)
app.use(json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/workflows", workflowRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/ai", aiRouter);
app.use(ErrorController);

export default app;
