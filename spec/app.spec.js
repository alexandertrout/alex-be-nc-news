process.env.NODE_ENV = "test";

const connection = require("../db/connection");
const app = require("../server/app");
const request = require("supertest");
const chaiSorted = require("chai-sorted");
const chai = require("chai");
const { expect } = chai;
chai.use(chaiSorted);

beforeEach(() => connection.seed.run());

after(() => connection.destroy());

describe("/api", () => {
  describe("/topics", () => {
    it("SAD - Status: 405 for invalid method on topic endpoint", () => {
      const methods = ["put", "patch", "delete", "post"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed on that endpoint!");
          });
      });
      return Promise.all(methodPromises);
    });
    describe("/GET", () => {
      it("HAPPY - gives a status of 200 and responds with an object containing an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.include.keys("description", "slug");
          });
      });
      it("SAD - gives a status of 404, msg key on the response body explains the reason", () => {
        return request(app)
          .get("/api/toop")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid Route!");
          });
      });
    });
  });
});
