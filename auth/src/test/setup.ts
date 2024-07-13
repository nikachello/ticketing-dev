import mongoose from "mongoose";

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
