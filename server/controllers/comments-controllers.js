const {
  updateCommentById,
  removeCommentById
} = require("../models/comments-models");

exports.patchCommentById = (req, res, next) => {
  let { comment_id } = req.params;
  let voteChange = req.body.inc_votes;
  updateCommentById(comment_id, voteChange)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  let { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "non existent comment_id" });
      res.sendStatus(204);
    })
    .catch(next);
};
