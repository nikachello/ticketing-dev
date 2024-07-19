import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("returns an error if no ticket", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await (global as any).signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    ticket: ticket,
    userId: "12345",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await (global as any).signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await (global as any).signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});
