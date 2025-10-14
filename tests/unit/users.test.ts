import request from "supertest";

import {app} from "../../src/index";

// Get all users endpoint test
describe("Getting all users", () => {
 test("Testing the get all users", async () => {
  const res = await request(app).get("/api/v1/users");
  expect(res.statusCode).toEqual(200);
  expect(res.body).toBeInstanceOf(Array); 
   });
});

// Get user by ID endpoint test
describe("Getting a user by ID", () => {
 test("Testing the get user by ID", async () => {
  const userId = "12345"; // Example user ID
  const res = await request(app).get(`/api/v1/users/${userId}`);
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("message", `get a user ${userId} received`);
   });
});