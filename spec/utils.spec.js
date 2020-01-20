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
    expect(list).to.deep.equal(list);
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
    expect(list).to.deep.equal(list);
  });
});

describe("formatComments", () => {});
