import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

const agent = request.agent(app);

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

//

it("returns a status other than 401 if the user is signed in", async () => {
  // Make a POST request to create a ticket with the cookie set
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", await (global as any).signin())
    .send({});

  // Assert that the response status code is not 401
  expect(response.status).not.toBe(401);
});

it("it returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "" })
    .expect(400);
});

it("it returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "title", price: -10 })
    .expect(400);
});

it("returns an error if price is empty", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "title", price: "" }) // No price provided
    .expect(400);
});

it("it creates a ticket if valid inputs are provided", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "title", price: 20 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("title");
  expect(tickets[0].price).toEqual(20);
});

it("publishes an event when ticket is created", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "title", price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
