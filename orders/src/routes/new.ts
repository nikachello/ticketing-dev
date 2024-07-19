import express, { Request, Response } from "express";
import { requireAuth, ValidateRequest } from "@chello12/common";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").notEmpty().withMessage("TicketId must be provided")],
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
