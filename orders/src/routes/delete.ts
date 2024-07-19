import { NotAuthorizedError, requireAuth } from "@chello12/common";
import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).send({ msg: ["Not found"] });
    }
    if (order!.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order!.status = OrderStatus.Cancelled;
    await order?.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
