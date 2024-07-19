import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches orders for an particular user", async () => {
  // Create three tickets
  const ticket1 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title1",
    price: 20,
  });
  await ticket1.save();

  const ticket2 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title2",
    price: 20,
  });
  await ticket2.save();

  const ticket3 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title2",
    price: 20,
  });
  await ticket3.save();

  const user1 = await (global as any).signin();
  const user2 = await (global as any).signin();

  //   Create one order as User n1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id });

  //   Create two orders as User n2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id });

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id });

  //   Make request to get orders for User n2

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.order.id);
  expect(response.body[1].id).toEqual(order2.order.id);
  //   Make sure we only got the orders for user n2
});
