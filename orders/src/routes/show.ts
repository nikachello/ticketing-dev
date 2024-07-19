import express, { Request, Response } from "express";
import { NotAuthorizedError, requireAuth } from "@chello12/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      res.status(404).send({ msg: ["Not found"] });
    }

    if (order!.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send({ order });
  }
);

export { router as showOrderRouter };
