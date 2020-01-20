const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  // This utility function should be able to take an array (list) of objects and return a new array. Each item in the new array must have its timestamp converted into a Javascript date object. Everything else in each item must be maintained.
  it("if passed an empty array return an empty array", () => {
    let list = [];
    expect(formatDates(list)).to.deep.equal([]);
  });
  it("can convert one object in the array to have the correct timestamp", () => {
    let list = [{ created_at: 1511354163389 }];
    let test = formatDates(list);
    expect(test).to.deep.equal([
      { created_at: new Date(1511354163389 * 1000) }
    ]);
  });
  it("can convert multiple objects in an array to have the correct timestamp", () => {
    let list = [
      { created_at: 1511354163389 },
      { created_at: 1511354163600 },
      { created_at: 1511354168000 }
    ];
    let test = formatDates(list);
    expect(test).to.deep.equal([
      { created_at: new Date(1511354163389 * 1000) },
      { created_at: new Date(1511354163600 * 1000) },
      { created_at: new Date(1511354168000 * 1000) }
    ]);
  });
  it("returns a different reference in memory, and does not mutate the original list array", () => {
    let list = [
      { created_at: 1511354163389 },
      { created_at: 1511354163600 },
      { created_at: 1511354168000 }
    ];
    let test = formatDates(list);
    expect(test).to.not.equal(list);
    expect(test[0].created_at).to.not.equal(list[0].created_at);
    expect(list).to.deep.equal([
      { created_at: 1511354163389 },
      { created_at: 1511354163600 },
      { created_at: 1511354168000 }
    ]);
  });
});

describe("makeRefObj", () => {
  // This utility function should be able to take an array (list) of objects and return a reference object. The reference object must be keyed by each item's title, with the values being each item's corresponding id.
  it("if passed an empty array return an empty array", () => {
    let list = [];
    expect(makeRefObj(list)).to.deep.equal([]);
  });
  it("can convert one object in the array to the correct reference object format", () => {
    let list = [{ article_id: 1, title: "A" }];
    let test = makeRefObj(list);
    expect(test).to.deep.equal({ A: 1 });
  });
  it("can convert multiple objects in the array to the correct reference object format", () => {
    let list = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    let test = makeRefObj(list);
    expect(test).to.deep.equal({ A: 1, B: 2, C: 3 });
  });
  it("returns a different reference in memory, and does not mutate the original list array", () => {
    let list = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    let test = formatDates(list);
    expect(test).to.not.equal(list);
    expect(list).to.deep.equal([
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ]);
  });
});

describe("formatComments", () => {
  // This utility function should be able to take an array of comment objects (comments) and a reference object, and return a new array of formatted comments. It Should Have:
  // Its created_by property renamed to an author key --
  // Its belongs_to property renamed to an article_id key --
  // The value of the new article_id key must be the id corresponding to the original title value provided --
  // Its created_at value converted into a javascript date object
  // The rest of the comment's properties must be maintained

  it("if passed an empty array return an empty array", () => {
    let comments = [];
    expect(formatComments(comments)).to.deep.equal([]);
  });
  it("can convert one object in the array to have the correct keys and values", () => {
    let comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    let articleRef = { "Living in the shadow of a great man": 1 };

    let test = formatComments(comments, articleRef);
    expect(test).to.deep.equal([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389 * 1000)
      }
    ]);
  });
  it("can convert multiple objects in the array to have the correct keys and values", () => {
    let comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: "Example comment for testing with.",
        belongs_to: "test text",
        created_by: "bridge_butter",
        votes: 16,
        created_at: 1479818168000
      }
    ];
    let articleRef = {
      "Living in the shadow of a great man": 1,
      "test text": 2
    };

    let test = formatComments(comments, articleRef);
    expect(test).to.deep.equal([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389 * 1000)
      },
      {
        body: "Example comment for testing with.",
        article_id: 2,
        author: "bridge_butter",
        votes: 16,
        created_at: new Date(1479818168000 * 1000)
      }
    ]);
  });
  it("returns a different reference in memory, and does not mutate the original comments array", () => {
    let comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: "Example comment for testing with.",
        belongs_to: "test text",
        created_by: "bridge_butter",
        votes: 16,
        created_at: 1479818168000
      }
    ];
    let articleRef = {
      "Living in the shadow of a great man": 1,
      "test text": 2
    };
    let test = formatComments(comments, articleRef);
    expect(test).to.not.equal(comments);
    expect(comments).to.deep.equal([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: "Example comment for testing with.",
        belongs_to: "test text",
        created_by: "bridge_butter",
        votes: 16,
        created_at: 1479818168000
      }
    ]);
  });
});
