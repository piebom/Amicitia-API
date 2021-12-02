const supertest = require('supertest');
const createServer = require("../src/createServer");
const {PrismaClient} = require('@prisma/client');
const bcrypt = require("bcrypt");


describe("User", () => {
  let server;
  let request;
  let prisma;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    prisma = new PrismaClient();
  });
  afterAll(async () => {
    server.stop();
    try{
      await prisma.user.delete({
        where: {
          email: "abc@gmail.com",
        }
      });
    }
    catch(e){
      
    }
  });

  describe("POST /api/user/register", () => {
    describe("Register User", () => {
      test("should respond with a 201 status", async () => {
        const response = await request.post("/api/user/register").send({
          "email": "abc@gmail.com",
          "password": "test123",
          "username": "test"
        })
        expect(response.statusCode).toBe(201)
      })
    })
  })
describe("POST /api/user/login", () => {
  describe("Login User", () => {
    test("should respond with a 200 status", async () => {
      const response = await request.post("/api/user/login").send({
        "email": "abc@gmail.com",
        "password": "test123"
      })
      expect(response.statusCode).toBe(200)
    })
  })
})
})