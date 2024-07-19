import { NotAuthorizedError, requireAuth } from "@chello12/common";
import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledEvent } from "@chello12/common";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      res.status(404).send({ msg: ["Not found"] });
    }
    if (order!.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order!.status = OrderStatus.Cancelled;
    await order?.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order?.id,
      ticket: {
        id: order?.ticket.id,
        price: order!.ticket.price,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
