import { app } from "../../app";
import request from "supertest";

const agent = request.agent(app);

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

//

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = await (global as any).signin();

  // Make a POST request to create a ticket with the cookie set
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({});

  // Assert that the response status code is not 401
  expect(response.status).not.toBe(401);
});

// it("it returns an error if an invalid title is provided", async () => {
//   await request(app).post("/api/tickets").set;
// });

// it("it returns an error if an invalid price is provided", async () => {});

// it("it creates a ticket if valid inputs are provided", async () => {});
