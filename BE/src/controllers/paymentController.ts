// const planUpgrade = catchAsync()

import { catchAsync } from "../lib/errors";
import {
  createIntention,
  PaymobIntentionRequest,
  PaymobTransaction,
  PaymobTransactionObject,
} from "../lib/paymob";
import { prisma } from "../lib/prisma";
import { AppError } from "./errorController";

export const checkout = catchAsync(async (req, res, next) => {
  const { planId } = req.body;
  const userId = req.session?.user?.id;
  const plan = await prisma.plan.findUnique({
    where: {
      id: planId,
    },
  });
  if (!plan) return next(new AppError(400, "INVALID_PLAN_SELECTED"));
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId: userId!,
      status: "ACTIVE",
      current_period_end: {
        gt: new Date(),
      },
    },
    include: {
      plan: true,
    },
  });
  if (existingSubscription) {
    return next(new AppError(400, "ALREADY_SUBSCRIBED"));
  }
  const subscription = await prisma.subscription.create({
    data: {
      userId: userId!,
      planId: plan.id!,
      status: "INACTIVE",
      cancel_at_period_end: false,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      amount: plan.price_in_cents,
      currency: "EGP",
      status: "INITIATED",
    },
  });

  const intentionData: PaymobIntentionRequest = {
    amount: plan.price_in_cents,
    items: [
      {
        name: plan.name,
        amount: plan.price_in_cents,
        quantity: 1,
        description: plan.name,
      },
    ],
    billing_data: {
      email: req.session?.user?.email!,
      first_name: req.session?.user?.name!,
      last_name: req.session?.user?.name!,
      phone_number: "+201000000000",
    },
    redirection_url: process.env.PAYMOB_REDIRECT_URL,
    notification_url: `${process.env.PAYMOB_NOTIFICATION_URL}/api/payments/confirm`,
    special_reference: payment.id,
  };
  const intention = await createIntention(intentionData);

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: "PENDING",
      intention_id: intention.id,
      client_secret: intention.client_secret,
    },
  });
  const redirectionUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${intention?.client_secret}
`;
  res.status(200).json({ redirectionUrl });
});

export const confirmPayment = catchAsync(async (req, res, next) => {
  const transactionObject = req.body as PaymobTransaction;
  console.log(transactionObject.obj.success, "SUCCESS");
  if (transactionObject.obj.success) {
    const payment = await prisma.payment.update({
      where: {
        id: transactionObject.obj.order.merchant_order_id!,
      },
      data: {
        status: "SUCCESS",
        gateway_transaction_id: transactionObject.obj.order.id,
        billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        billing_period_start: new Date(),
      },
    });
    await prisma.subscription.update({
      where: {
        id: payment.subscriptionId,
      },
      data: {
        status: "ACTIVE",
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
});

export const getSubscription = catchAsync(async (req, res, next) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: req.session?.user?.id as string,
      status: "ACTIVE",
      current_period_end: {
        gt: new Date(),
      },
    },
    include: {
      plan: true,
    },
  });
  res.status(200).json({ isSubscribed: !!subscription, subscription });
});
