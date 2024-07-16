import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  ValidateRequest,
  requireAuth,
  NotAuthorizedError,
} from "@chello12/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title should be provided"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Please provide correct price"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404).send("Not found");
    }

    if (ticket?.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    ticket?.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket?.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
