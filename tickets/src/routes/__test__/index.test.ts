import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("can fetch a list of tickets", async () => {
  const post1 = await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "title1", price: 20 });
  const post2 = await request(app)
    .post("/api/tickets")
    .set("Cookie", await (global as any).signin())
    .send({ title: "title2", price: 40 });

  const allTicketsBefore = await Ticket.find({});

  const response = await request(app).get("/api/tickets").send().expect(200);

  const allTicketsAfter = await Ticket.find({});

  expect(response.body.length).toEqual(2);
});
