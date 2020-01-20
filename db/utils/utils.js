exports.formatDates = list => {
  let newList = list
    .map(obj => {
      return { ...obj };
    })
    .map(newObj => {
      let newTimestamp = new Date(newObj.created_at * 1000);
      newObj.created_at = newTimestamp;
      return newObj;
    });
  return newList;
};

exports.makeRefObj = list => {
  if (list.length < 1) return [];
  let refObj = {};
  for (let i = 0; i < list.length; i++) {
    refObj[list[i].title] = list[i].article_id;
  }
  return refObj;
};

exports.formatComments = (comments, articleRef) => {};
