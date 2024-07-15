import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is not present");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI should be present");
  }
  try {
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
