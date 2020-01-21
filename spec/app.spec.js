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
  it("SAD - status 404 - invalid route (path)", () => {
    return request(app)
      .get("/boo")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Invalid Route!");
      });
  });
  describe("/topics", () => {
    it("SAD - status 405 - invalid method on topic endpoint", () => {
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
      it("HAPPY - status 200 - responds with an object containing an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.include.keys("description", "slug");
          });
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      it("SAD - status 405 - invalid method on users endpoint", () => {
        const methods = ["put", "patch", "delete", "post"];
        const methodPromises = methods.map(method => {
          return request(app)
            [method]("/api/users/:username")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed on that endpoint!");
            });
        });
        return Promise.all(methodPromises);
      });
      describe("GET", () => {
        it("HAPPY - status 200 - responds with an object of the requested user", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.deep.equal({
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
              });
            });
        });
        it("SAD - status 404 - msg key on the response body explains error is due to non-existant username", () => {
          return request(app)
            .get("/api/users/charger")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non existent username");
            });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("SAD - status 405 - invalid method on /:article_id endpoint", () => {
        const methods = ["put", "delete", "post"];
        const methodPromises = methods.map(method => {
          return request(app)
            [method]("/api/articles/:article_id")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed on that endpoint!");
            });
        });
        return Promise.all(methodPromises);
      });
      describe("/GET", () => {
        it("HAPPY - status 200 - responds with an object of the requested article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.be.an("object");
            });
        });
        it("HAPPY - status 200 - article_id object has all required keys, including added comment_count with correct value", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.include.keys(
                "article_id",
                "title",
                "topic",
                "author",
                "body",
                "votes",
                "created_at",
                "comment_count"
              );
              expect(body.article.comment_count).to.equal(13);
            });
        });
        it("SAD - status 404 - msg key on the response body explains error is due to non-existant article_id", () => {
          return request(app)
            .get("/api/articles/300")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non existent article_id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid article_id", () => {
          return request(app)
            .get("/api/articles/not-article-id")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid article_id");
            });
        });
      });
    });
  });
});
