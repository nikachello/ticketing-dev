import { app } from "../../app";
import request from "supertest";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

// it("it can only be accessed if user is logged in", async () => {
//   const response = await request(app).post("/api/tickets").send({}).expect(401);
// });

// it("returns a status other than 401 if the user is signed in", async () => {
//   const response = await request(app)
//     .post("/api/tickets/")
//     .set("Cookie", (global as any).signin())
//     .send({});

//   console.log(response.headers["set-cookie"]);
//   expect(response.status).not.toEqual(401);
// });

// it("it returns an error if an invalid title is provided", async () => {
//   await request(app).post("/api/tickets").set;
// });

// it("it returns an error if an invalid price is provided", async () => {});

// it("it creates a ticket if valid inputs are provided", async () => {});
