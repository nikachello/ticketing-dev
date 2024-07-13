import { app } from "../../app";
import request from "supertest";

it("it returns currently logged in user data", async () => {
  const cookie = await (global as any).signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie!)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("respnds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentUser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
