import express, { Request, Response } from "express";
import { stripe } from "../stripe";
import { body } from "express-validator";
import {
  requireAuth,
  ValidateRequest,
  badRequestError,
  NotAuthorizedError,
  OrderStatus,
} from "@chello12/common";

import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").notEmpty(), body("orderId").notEmpty()],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).send({ msg: ["Order is not found"] });
    }
    if (order!.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order!.status === OrderStatus.Cancelled) {
      throw new badRequestError("Order is cancelled");
    }

    const payment = await stripe.paymentIntents.create({
      amount: order!.price,
      currency: "usd",
      confirm: true,
      payment_method: "pm_card_visa",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    res.send({ success: payment });
  }
);

export { router as CreateChargeRouter };
