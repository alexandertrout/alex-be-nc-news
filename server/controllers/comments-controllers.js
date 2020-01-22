const { updateCommentById } = require("../models/comments-models");

exports.patchCommentById = (req, res, next) => {
  let { comment_id } = req.params;
  let voteChange = req.body.inc_votes;
  updateCommentById(comment_id, voteChange)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
