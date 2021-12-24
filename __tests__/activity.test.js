const supertest = require('supertest');
const createServer = require("../src/createServer");
const {PrismaClient} = require('@prisma/client');
const bcrypt = require("bcrypt");


describe("Activity", () => {
  let server;
  let request;
  let prisma;
  let token;
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    prisma = new PrismaClient();
    token = (await prisma.user.findUnique({where:{email:"pieter.bommele@student.hogent.be"}})).token
  });
  afterAll(async () => {
    server.stop();
    try{
      //add data
    }
    catch(e){
      
    }
  });

  describe("GET /api/activities?page=1&limit=10", () => {
    describe("Get the 10 latest activities", () => {
      test("should respond with a 200 status", async () => {
        const response = await request.get("/api/activities?page=1&limit=10").auth(token, { type: 'bearer' })
        expect(response.statusCode).toBe(200)
      })
    })
  })
})