const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

let originalLog;
let token;
let db;

beforeAll(async () => {
    originalLog = console.log;
    console.log = jest.fn();
  
    // Close existing connections
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  
    // Connect to test database
    db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    const response = await request(app).post("/api/auth/login")
    .send({
          username: "testuser",
          password: "password",
      });
    token = response.body.data.token;
  });
  

  afterAll(async () => {
    console.log = originalLog;

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

describe("POST /api/auth/login", () => {
    it("Should return 401 with wrong password", async () => {
        const response = await request(app).post("/api/auth/login").send({
            username: "testuser",
            password: "wrongpassword",
        });
        expect(response.statusCode).toBe(401);
    });

    it("Should return token in body", async () => {
        const response = await request(app).post("/api/auth/login").send({
            username: "testuser",
            password: "password",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('token');
    });
});

describe("POST /api/auth/logout", () => {
    it("Should return 401 with no token", async () => {
        const response = await request(app).post("/api/auth/logout");
        expect(response.statusCode).toBe(401);
    });

    it("Should return 200 with token", async () => {
        const response = await request(app).post("/api/auth/logout").set('authorization-token', `token: ${token}`);
        console.log(token);
        expect(response.statusCode).toBe(200);
    });
});