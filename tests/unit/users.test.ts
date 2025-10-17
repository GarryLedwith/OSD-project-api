import request from "supertest";
import {app} from "../../src/index";

// Variable to store the created user ID for use across tests
let createdUserId: string;

// Get all users endpoint test
describe("Getting all users", () => {
 test("Testing the get all users", async () => {
  const res = await request(app).get("/api/v1/users");
  expect(res.statusCode).toEqual(200);
  expect(res.body).toBeInstanceOf(Array);
   });
});

// Create user endpoint test - run this first to create a test user
describe("Creating a new user", () => {
 test("Testing the create user", async () => {
   const newUser = {
      name: "John Doe",
      phonenumber: "0812345678",
      email: "john.doe@student.atu.ie",
      role: "student",
      dob: "1990-01-01"
   };
  const res = await request(app).post("/api/v1/users").send(newUser);
  expect(res.statusCode).toEqual(201);
  expect(res.body).toHaveProperty("insertedId");

  // Store the created user ID for subsequent tests
  createdUserId = res.body.insertedId;
  expect(createdUserId).toBeDefined();
   });
});

// Get user by ID endpoint test - uses the created user ID
describe("Getting a user by ID", () => {
 test("Testing the get user by ID", async () => {
  const res = await request(app).get(`/api/v1/users/${createdUserId}`);
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("_id");
  expect(res.body._id).toEqual(createdUserId);
  expect(res.body.name).toEqual("John Doe");
  expect(res.body.email).toEqual("john.doe@student.atu.ie");
   });
});

// Update user endpoint test - uses the created user ID
describe("Updating a user", () => {
 test("Testing the update user", async () => {
   const updatedData = {
      name: "Jane Doe",
      phonenumber: "0887654321",
      email: "jane.doe@student.atu.ie",
      role: "student",
      dob: "1995-05-15"
   };
  const res = await request(app).put(`/api/v1/users/${createdUserId}`).send(updatedData);
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toContain("updated successfully");
   });
});

// Delete user endpoint test - uses the created user ID and cleans up
describe("Deleting a user", () => {
 test("Testing the delete user", async () => {
  const res = await request(app).delete(`/api/v1/users/${createdUserId}`);
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toContain("deleted successfully");
   });
});
