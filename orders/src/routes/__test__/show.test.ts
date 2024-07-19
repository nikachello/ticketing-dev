import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  const user = await (global as any).signin();

  // Create a ticket
  const ticket = Ticket.build({
    id: user.id,
    title: "title",
    price: 20,
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  console.log(order.order.id);

  // make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.order.id).toEqual(order.order.id);
});
