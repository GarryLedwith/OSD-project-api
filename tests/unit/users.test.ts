import request from "supertest";
import { app } from "../../src/index";
import { ObjectId } from "mongodb";

// Variable to store the created user ID for use across tests
let createdUserId: string;
let createdStaffId: string;

// Create user endpoint tests
describe("Creating a new user", () => {
  test("Should create a new student user with valid data", async () => {
    const newUser = {
      name: "John Doe",
      phone: "0812345678",
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

  test("Should create a new staff user with valid data", async () => {
    const newStaffUser = {
      name: "Jane Smith",
      phone: "0823456789",
      email: "jane.smith@staff.atu.ie",
      role: "staff",
      dob: "1985-05-15"
    };

    const res = await request(app).post("/api/v1/users").send(newStaffUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("insertedId");

    createdStaffId = res.body.insertedId;
    expect(createdStaffId).toBeDefined();
  });

  test("Should create a new admin user with valid data", async () => {
    const newAdminUser = {
      name: "Admin User",
      phone: "0834567890",
      email: "admin.user@admin.atu.ie",
      role: "admin",
      dob: "1980-03-20"
    };

    const res = await request(app).post("/api/v1/users").send(newAdminUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("insertedId");
  });

  test("Should fail to create user without name", async () => {
    const invalidUser = {
      phone: "0812345678",
      email: "test@student.atu.ie",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create user without phone", async () => {
    const invalidUser = {
      name: "Test User",
      email: "test@student.atu.ie",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create user without email", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create user without role", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "test@student.atu.ie",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail to create user without dob", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "test@student.atu.ie",
      role: "student"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail with invalid phone number format (not starting with 08)", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "1234567890",
      email: "test@student.atu.ie",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail with invalid phone number length", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345",
      email: "test@student.atu.ie",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail with invalid email format", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "invalid-email",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail when student email doesn't match student role", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "test@staff.atu.ie",
      role: "student",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail when staff email doesn't match staff role", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "test@student.atu.ie",
      role: "staff",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail when admin email doesn't match admin role", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "test@student.atu.ie",
      role: "admin",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

  test("Should fail with invalid role", async () => {
    const invalidUser = {
      name: "Test User",
      phone: "0812345678",
      email: "test@student.atu.ie",
      role: "invalid-role",
      dob: "1990-01-01"
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);
    expect(res.statusCode).toEqual(400);
  });

});

// Get all users endpoint test
describe("Getting all users", () => {
  test("Should return all users", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// Get user by ID endpoint tests
describe("Getting a user by ID", () => {
  test("Should return user by valid ID", async () => {
    const res = await request(app).get(`/api/v1/users/${createdUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body._id).toEqual(createdUserId);
    expect(res.body.name).toEqual("John Doe");
    expect(res.body.email).toEqual("john.doe@student.atu.ie");
    expect(res.body.role).toEqual("student");
  });

  
});

// Get users by role endpoint tests
describe("Getting users by role", () => {
  test("Should return users with student role", async () => {
    const res = await request(app).get("/api/v1/users/role/student");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    // Verify all returned users have student role
    res.body.forEach((user: any) => {
      expect(user.role).toEqual("student");
    });
  });

  test("Should return users with staff role", async () => {
    const res = await request(app).get("/api/v1/users/role/staff");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    // Verify all returned users have staff role
    res.body.forEach((user: any) => {
      expect(user.role).toEqual("staff");
    });
  });

  test("Should return users with admin role", async () => {
    const res = await request(app).get("/api/v1/users/role/admin");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    // Verify all returned users have admin role
    res.body.forEach((user: any) => {
      expect(user.role).toEqual("admin");
    });
  });

 
});

// Update user endpoint tests (PUT - full update)
describe("Updating a user (PUT)", () => {
  test("Should update user with complete valid data", async () => {
    const updatedData = {
      name: "Jane Doe",
      phone: "0887654321",
      email: "jane.doe@student.atu.ie",
      role: "student",
      dob: "1995-05-15"
    };

    const res = await request(app).put(`/api/v1/users/${createdUserId}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("updated successfully");
  });

  

  test("Should fail to update with invalid data", async () => {
    const invalidData = {
      name: "Test User",
      phone: "123", // Invalid phone
      email: "test@student.atu.ie",
      role: "student",
      dob: "1995-05-15"
    };

    const res = await request(app).put(`/api/v1/users/${createdUserId}`).send(invalidData);
    expect(res.statusCode).toEqual(400);
  });


});

// PATCH user endpoint tests
describe("Partially updating a user (PATCH)", () => {
  test("Should partially update user with only phone number", async () => {
    const partialUpdate = {
      phone: "0899999999"
    };

    const res = await request(app).patch(`/api/v1/users/${createdUserId}`).send(partialUpdate);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("updated successfully");
  });

  test("Should verify partial update only changed specified field", async () => {
    const res = await request(app).get(`/api/v1/users/${createdUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.phone).toEqual("0899999999"); // Phone was updated
    expect(res.body.name).toEqual("Jane Doe"); // Name should remain from previous update
    expect(res.body.email).toEqual("jane.doe@student.atu.ie"); // Email should remain unchanged
  });

  test("Should partially update user with only name", async () => {
    const partialUpdate = {
      name: "John Updated"
    };

    const res = await request(app).patch(`/api/v1/users/${createdUserId}`).send(partialUpdate);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
  });


});

// Delete user endpoint tests
describe("Deleting a user", () => {
  test("Should delete user by valid ID", async () => {
    const res = await request(app).delete(`/api/v1/users/${createdUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("deleted successfully");
  });

});
