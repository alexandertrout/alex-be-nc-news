const connection = require("../../db/connection");

exports.updateCommentById = (comment_id, voteChange) => {
  if (typeof voteChange !== "number" || voteChange === null || voteChange === 0)
    return Promise.reject({
      status: 400,
      msg: "invalid data type in the request body"
    });
  return connection("comments")
    .where("comment_id", comment_id)
    .returning("*")
    .then(comments => {
      if (comments.length === 0)
        return Promise.reject({
          status: 404,
          msg: "valid but non existent comment_id"
        });
      comments[0].votes += voteChange;
      return connection("comments")
        .where("comment_id", comment_id)
        .update(comments[0])
        .returning("*");
    })
    .then(patchedComment => {
      return patchedComment[0];
    });
};
