const connection = require("../../db/connection");

exports.removeCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del();
};

exports.fetchCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .then(comment => {
      if (comment.length === 0)
        return Promise.reject({
          status: 404,
          msg: "valid but non existent comment_id"
        });
      else return comment;
    });
};

exports.updateCommentById = (comment_id, voteChange) => {
  if (typeof voteChange !== "number" || voteChange === 0)
    return Promise.reject({
      status: 400,
      msg: "invalid data type in the request body"
    });
  return connection("comments")
    .where("comment_id", comment_id)
    .returning("*")
    .then(comment => {
      if (comment.length === 0) return comment;
      comment[0].votes += voteChange;
      return connection("comments")
        .where("comment_id", comment_id)
        .update(comment[0])
        .returning("*");
    })
    .then(patchedComment => {
      return patchedComment[0];
    });
};

exports.checkCommentExists = comment_id => {
  return connection("comments")
    .select("*")
    .where("comment_id", comment_id)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "valid but non existent comment_id"
        });
      }
    });
};
