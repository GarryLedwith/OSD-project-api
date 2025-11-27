import request from "supertest";
import { app } from "../../src/index";
import { ObjectId } from "mongodb";

// Variables to store IDs for use across tests
let createdEquipmentId: string;
let createdBookingId: string;
let testUserId: string;

// Create equipment endpoint test
describe("Creating new equipment", () => {
  test("Should create a new equipment item with all required fields", async () => {
    const newEquipment = {
      name: "MacBook Pro",
      category: "Laptop",
      description: "16-inch MacBook Pro with M2 chip",
      status: "available",
      location: "IT Lab 101",
      model: "MacBook Pro 16-inch 2023"
    };

    const res = await request(app).post("/api/v1/equipment").send(newEquipment);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toEqual(newEquipment.name);
    expect(res.body.category).toEqual(newEquipment.category);
    expect(res.body.status).toEqual("available");
    expect(res.body).toHaveProperty("bookings");
    expect(res.body.bookings).toEqual([]);

    // Store the created equipment ID for the remainder tests
    createdEquipmentId = res.body._id;
    expect(createdEquipmentId).toBeDefined();
  });

  test("Should fail to create equipment without name", async () => {
    const invalidEquipment = {
      category: "Laptop"
    };

    const res = await request(app).post("/api/v1/equipment").send(invalidEquipment);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create equipment without category", async () => {
    const invalidEquipment = {
      name: "Test Device"
    };

    const res = await request(app).post("/api/v1/equipment").send(invalidEquipment);
    expect(res.statusCode).toEqual(400);
  });
});

// Get all equipment endpoint tests
describe("Getting all equipment", () => {
  test("Should return all equipment items", async () => {
    const res = await request(app).get("/api/v1/equipment");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

 
  test("Should filter equipment by status", async () => {
    const res = await request(app).get("/api/v1/equipment?status=available");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    // If results exist, verify they match the filter
    if (res.body.length > 0) {
      res.body.forEach((item: any) => {
        expect(item.status).toEqual("available");
      });
    }
  });
});

// Get equipment by ID endpoint tests
describe("Getting equipment by ID", () => {
  test("Should return equipment item by valid ID", async () => {
    const res = await request(app).get(`/api/v1/equipment/${createdEquipmentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body._id).toEqual(createdEquipmentId);
    expect(res.body.name).toEqual("MacBook Pro");
    expect(res.body.category).toEqual("Laptop");
  });

  
});

// Update equipment endpoint tests
describe("Updating equipment", () => {
  test("Should update equipment with valid data", async () => {
    const updatedData = {
      name: "MacBook Pro Updated",
      status: "maintenance",
      location: "IT Lab 102"
    };

    const res = await request(app)
      .patch(`/api/v1/equipment/${createdEquipmentId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toEqual(updatedData.name);
    expect(res.body.status).toEqual(updatedData.status);
    expect(res.body.location).toEqual(updatedData.location);
    expect(res.body).toHaveProperty("updatedAt");
  });

  test("Should update only specified fields", async () => {
    const partialUpdate = {
      status: "available"
    };

    const res = await request(app)
      .patch(`/api/v1/equipment/${createdEquipmentId}`)
      .send(partialUpdate);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual(partialUpdate.status);
    expect(res.body.name).toEqual("MacBook Pro Updated");
  });

  
});

// Booking creation endpoint tests
describe("Creating equipment bookings", () => {
  beforeAll(() => {
    // Create a test user ID for booking tests
    testUserId = new ObjectId().toString();
  });

  test("Should create a new booking for equipment", async () => {
    const bookingData = {
      userId: testUserId,
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: "2025-01-05T00:00:00.000Z"
    };

    const res = await request(app)
      .post(`/api/v1/equipment/${createdEquipmentId}/bookings`)
      .send(bookingData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.userId).toEqual(bookingData.userId);
    expect(res.body.status).toEqual("pending"); // Default status
    expect(res.body).toHaveProperty("startDate");
    expect(res.body).toHaveProperty("endDate");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");

    // Store the booking ID for remainder of tests
    createdBookingId = res.body._id;
    expect(createdBookingId).toBeDefined();
  });

  test("Should fail to create booking without userId", async () => {
    const invalidBooking = {
      startDate: "2025-01-10T00:00:00.000Z",
      endDate: "2025-01-15T00:00:00.000Z"
    };

    const res = await request(app)
      .post(`/api/v1/equipment/${createdEquipmentId}/bookings`)
      .send(invalidBooking);

    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create booking without startDate", async () => {
    const invalidBooking = {
      userId: testUserId,
      endDate: "2025-01-15T00:00:00.000Z"
    };

    const res = await request(app)
      .post(`/api/v1/equipment/${createdEquipmentId}/bookings`)
      .send(invalidBooking);

    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create booking without endDate", async () => {
    const invalidBooking = {
      userId: testUserId,
      startDate: "2025-01-10T00:00:00.000Z"
    };

    const res = await request(app)
      .post(`/api/v1/equipment/${createdEquipmentId}/bookings`)
      .send(invalidBooking);

    expect(res.statusCode).toEqual(400);
  });

});

// Get bookings endpoint tests
describe("Getting equipment bookings", () => {
  test("Should return all bookings for equipment", async () => {
    const res = await request(app)
      .get(`/api/v1/equipment/${createdEquipmentId}/bookings`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Should filter bookings by status", async () => {
    const res = await request(app)
      .get(`/api/v1/equipment/${createdEquipmentId}/bookings?status=pending`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    // If results exist, verify they match the filter
    if (res.body.length > 0) {
      res.body.forEach((booking: any) => {
        expect(booking.status).toEqual("pending");
      });
    }
  });

});

// Delete equipment endpoint tests (cleanup and testing)
describe("Deleting equipment", () => {
  test("Should delete equipment by valid ID", async () => {
    const res = await request(app).delete(`/api/v1/equipment/${createdEquipmentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("deleted successfully");
  });

});
