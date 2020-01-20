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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
