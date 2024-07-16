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

  console.log("Posted tickets:", post1.body, post2.body);

  const allTicketsBefore = await Ticket.find({});
  console.log("All tickets before GET request:", allTicketsBefore);

  const response = await request(app).get("/api/tickets").send().expect(200);

  console.log("Response body:", response.body);

  const allTicketsAfter = await Ticket.find({});
  console.log("All tickets after GET request:", allTicketsAfter);

  expect(response.body.length).toEqual(2);
});
