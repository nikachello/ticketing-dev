import express, { Request, Response } from "express";
import {
  badRequestError,
  OrderStatus,
  requireAuth,
  ValidateRequest,
} from "@chello12/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").notEmpty().withMessage("TicketId must be provided")],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      res.status(404).send({
        msg: ["Ticket not found"],
      });
    }

    const isReserved = await ticket?.isReserved();
    if (isReserved) {
      throw new badRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket!,
    });

    await order.save();

    // Publish an event saying that an order was created

    res.send({ order });
  }
);

export { router as newOrderRouter };
