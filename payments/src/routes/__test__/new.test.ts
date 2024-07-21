import request from "supertest";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { app } from "../../app";
import { OrderStatus } from "@chello12/common";

it("returns a 404 an error if order is not found", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", await (global as any).signin())
    .send({
      token: "asdsad",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 if signed user is not owner of the order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await (global as any).signin())
    .send({
      token: "asdsad",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await (global as any).signin(userId))
    .send({
      orderId: order.id,
      token: "asdasd",
    })
    .expect(400);
});
