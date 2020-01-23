process.env.NODE_ENV = "test";

const connection = require("../db/connection");
const app = require("../server/app");
const request = require("supertest");
const chaiSorted = require("chai-sorted");
const chai = require("chai");
const { expect } = chai;
chai.use(chaiSorted);
chai.use(require("sams-chai-sorted"));

beforeEach(() => connection.seed.run());

after(() => connection.destroy());

describe("/api", () => {
  xdescribe("GET", () => {
    it("SAD - status 200 - responds with JSON describing all the available endpoints on the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(response => {
          expect(JSON.parse(response.text)).to.deep.equal({
            msg: "endpoints endpoints endpoints"
          });
        });
    });
  });
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
    it("SAD - status 405 - invalid method on /:comment_id endpoint", () => {
      const methods = ["put", "delete", "post", "patch"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed on that endpoint!");
          });
      });
      return Promise.all(methodPromises);
    });
    describe("GET", () => {
      it("HAPPY - status 200 - responds with an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes"
            );
          });
      });
      it("HAPPY - status 200 - the article objects in the array order_by default is created_at desc", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("HAPPY - status 200 - the article objects in the array include a comment_count key", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain.keys("comment_count");
          });
      });
      it("HAPPY - status 200 - the comment_count keys have the correct associated values", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].comment_count).to.equal(13);
          });
      });
      it("HAPPY - status 200 - should accept sort_by and order querys", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("author");
          });
      });
      it("HAPPY - status 200 - should accept author and topic querys", () => {
        return request(app)
          .get(
            "/api/articles?author=rogersop&topic=mitch&sort_by=votes&order=asc"
          )
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("votes");
            expect(body.articles[0].author).to.equal("rogersop");
            expect(body.articles[0].topic).to.equal("mitch");
          });
      });
      it("SAD - status 400 - msg key on the response body explains error is due to non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=topicthatdoesntexisit")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "invalid topic query - topic does not exist"
            );
          });
      });
      it("SAD - status 400 - msg key on the response body explains error is due to non-existent author", () => {
        return request(app)
          .get("/api/articles?author=timmy")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "invalid author query - user does not exist"
            );
          });
      });
    });
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
      describe("GET", () => {
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
            .get("/api/articles/400")
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
              expect(body.msg).to.equal("invalid id");
            });
        });
      });
      describe("PATCH", () => {
        it("HAPPY - status 200 - responds with an object of the correctly updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(90);
              expect(body.article).to.include.keys(
                "article_id",
                "title",
                "topic",
                "author",
                "body",
                "votes",
                "created_at"
              );
            });
        });
        it("HAPPY - status 200 - responds with an unchanged article if no req body is passed", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.deep.equal({
                article_id: 1,
                author: "butter_bridge",
                body: "I find this existence challenging",
                comment_count: 13,
                created_at: "2018-11-15T12:21:54.171Z",
                title: "Living in the shadow of a great man",
                topic: "mitch",
                votes: 100
              });
            });
        });
        it("SAD - status 404 - msg key on the response body explains error is due to non-existant article_id", () => {
          return request(app)
            .patch("/api/articles/100")
            .send({ inc_votes: -10 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non-exisitent article_id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid article_id", () => {
          return request(app)
            .patch("/api/articles/not-article-id")
            .send({ inc_votes: -10 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid data type in the req body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "100" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "invalid data type in the request body"
              );
            });
        });
      });
    });
    describe("/:article_id/comments", () => {
      it("SAD - status 405 - invalid method on /:comment_id endpoint", () => {
        const methods = ["put", "delete", "post", "patch"];
        const methodPromises = methods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed on that endpoint!");
            });
        });
        return Promise.all(methodPromises);
      });
      describe("POST", () => {
        it("HAPPY - status 200 - responds with an object of the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "rogersop", body: "This is a test comment" })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.body).to.equal("This is a test comment");
              expect(body.comment.article_id).to.equal(1);
              expect(body.comment.author).to.equal("rogersop");
              expect(body.comment.votes).to.equal(0);
              expect(body.comment).to.contain.keys("created_at");
            });
        });
        it("SAD - status 404 - msg key on the response body explains error is due to non-existent article_id", () => {
          return request(app)
            .post("/api/articles/300/comments")
            .send({ username: "rogersop", body: "This is a test comment" })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non-exisitent");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid article_id", () => {
          return request(app)
            .post("/api/articles/not-article-id/comments")
            .send({ username: "rogersop", body: "This is a test comment" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid data type in the req body / empty body", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "invalid data type in the request body"
              );
            });
        });
        it("SAD - status 404 - msg key on the response body explains error is due to invalid username in the req body", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "alex", body: "This is a test comment" })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non-exisitent");
            });
        });
      });
      describe("GET", () => {
        it("HAPPY - status 200 - responds with an array of comment objects, each having the correct properties", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0]).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
              expect(body.comments.length).to.equal(13);
            });
        });
        it("HAPPY - status 200 - responds with an array of comment objects, accepting the sort_by (created_at default) and order (desc default) queries", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("HAPPY - status 200 - responds with an array of comment objects, accepting any valid column as the the sort_by query", () => {
          termsArray = ["votes", "body", "author", "created_at", "comment_id"];
          const sort_byPromises = termsArray.map(term => {
            return request(app)
              .get(`/api/articles/1/comments?sort_by=${term}&order=asc`)
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy(`${term}`);
              });
          });
          return Promise.all(sort_byPromises);
        });
        it("HAPPY - status 200 - responds with an empty array if an article exisits but has no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).to.equal(0);
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to non existent article_id", () => {
          return request(app)
            .get("/api/articles/550/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non-exisitent article_id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid article_id", () => {
          return request(app)
            .get("/api/articles/not-an-id/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid id");
            });
        });
        it("SAD - status 422 - msg key on the response body explains error is due to invalid request query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=not_a_column")
            .expect(422)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid query");
            });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("SAD - status 405 - invalid method on /:comment_id endpoint", () => {
        const methods = ["put", "post", "get"];
        const methodPromises = methods.map(method => {
          return request(app)
            [method]("/api/comments/:comment_id")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed on that endpoint!");
            });
        });
        return Promise.all(methodPromises);
      });
      describe("PATCH", () => {
        it("HAPPY - status 200 - responds with an object of the correctly updated comment", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
              expect(typeof body.comment).to.equal("object");
            });
        });
        it("SAD - status 404 - msg key on the response body explains error is due to non-existant comment_id", () => {
          return request(app)
            .patch("/api/comments/200")
            .send({ inc_votes: -10 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("valid but non existent comment_id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid comment_id", () => {
          return request(app)
            .patch("/api/comments/not-an-id")
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid data type in the req body / empty body", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: "votes" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "invalid data type in the request body"
              );
            });
        });
      });
      describe("DELETE", () => {
        it("HAPPY - status 204 - deletes the comment by comment_id and does not respond with anything", () => {
          return request(app)
            .delete("/api/comments/2")
            .expect(204);
        });
        it("SAD - status 404 - msg key on the response body explains error is due to non existent comment_id", () => {
          return request(app)
            .delete("/api/comments/200")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("non existent comment_id");
            });
        });
        it("SAD - status 400 - msg key on the response body explains error is due to invalid comment_id", () => {
          return request(app)
            .delete("/api/comments/invalid-id")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("invalid id");
            });
        });
      });
    });
  });
});
