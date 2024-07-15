import { requireAuth } from "@chello12/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  res.status(200).send("asdasd");
});

export { router as createTicketRouter };
