import { Router } from "express";
import {
  confirmPayment,
  getSubscription,
  checkout,
} from "../controllers/payment.controller";
import { checkAuth } from "../lib/errors";

export const paymentRouter = Router();

paymentRouter.route("/checkout").post(checkAuth, checkout);
paymentRouter.route("/confirm").post(checkAuth, confirmPayment);
paymentRouter.route("/my-subscription").get(checkAuth, getSubscription);
