import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper.ts");

beforeAll(async () => {
  jest.setTimeout(60000); // 60 seconds timeout
  process.env.JWT_KEY = "asdf";

  const mongoUri = "mongodb://localhost:27017/test"; // Local MongoDB instance
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

(global as any).signin = async (id?: string) => {
  // Build a JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "guest@guests.com",
  };

  // Create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. {jwt: my_jwt}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return `session=${base64}`;
};
