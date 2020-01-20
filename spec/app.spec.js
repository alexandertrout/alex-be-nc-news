process.env.NODE_ENV = "test";

const connection = require("../db/connection");
const app = require("../server/app");
const request = require("supertest");
const chaiSorted = require("chai-sorted");
const chai = require("chai");
const { expect } = chai;
chai.use(chaiSorted);
after(() => connection.destroy());

describe("/api", () => {
  describe("/topics", () => {
    describe("/GET", () => {
      it("gives a status of 200 and responds with an object containing an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            // expect(body.t[0]).to.include.keys(
            //   "treasure_id",
            //   "treasure_name",
            //   "colour",
            //   "age",
            //   "cost_at_auction"
            // );
          });
      });
    });
  });
});
