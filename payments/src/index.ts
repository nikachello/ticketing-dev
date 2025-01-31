import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is not present");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI should be present");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS cluster ID should be present");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS client ID should be present");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS url should be present");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    natsWrapper.client.on("disconnect", () => {
      console.log("disconnected");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client!.close());
    process.on("SIGTERM", () => natsWrapper.client!.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
