import request from "supertest";
import {app} from "../../src/index";

// Basic server running and answering ping test
describe("Basic server running and answering ping", () => {
 test("Testing the ping", async () => {
  const res = await request(app).get("/ping");
  expect(res.statusCode).toEqual(200);
  expect(res.body).toEqual({ message: "Welcome to the Lab Equipment Loaner Project API" }); 
    });
});

// Health check endpoint test
describe("Health check endpoint", () => {
  test("Testing the health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Server is up and running" });
    
  }); 
})