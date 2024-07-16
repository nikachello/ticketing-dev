import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  console.log("GET /api/tickets called");

  const tickets = await Ticket.find({});
  console.log("Fetched tickets from DB:", tickets);

  res.send(tickets);
});

export { router as indexTicketRouter };
