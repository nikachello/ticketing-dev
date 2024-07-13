import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

beforeAll(async () => {
  jest.setTimeout(60000); // 60 seconds timeout
  process.env.JWT_KEY = "asdf";

  const mongoUri = "mongodb://localhost:27017/test"; // Local MongoDB instance
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

(global as any).signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
