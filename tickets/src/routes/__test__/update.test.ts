import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id doesn't exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", await (global as any).signin())
    .send({ title: "title", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "title", price: 20 })
    .expect(401);
});

it("returns a 401 if the user doesn't have permission to edit the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", await (global as any).signin())
    .send({ title: "title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await (global as any).signin())
    .send({
      title: "new title",
      price: "100",
    })
    .expect(401);
});

it("returns a 400 if the user didn't provide correct title and price", async () => {
  const cookie = await (global as any).signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "title", price: -10 })
    .expect(400);
});

it("updates the ticket if provided valid inouts", async () => {
  const cookie = await (global as any).signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "edited title", price: 30 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("edited title");
  expect(ticketResponse.body.price).toEqual(30);
});

it("can't update the ticket if it is locked (orderId is present)", async () => {
  const cookie = await (global as any).signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "title", price: 20 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "edited title", price: 30 })
    .expect(400);
});
