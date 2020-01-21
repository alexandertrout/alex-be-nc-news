const {
  fetchArticleById,
  patchVotesById,
  createNewCommentByArticleId
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateVotesById = (req, res, next) => {
  let { article_id } = req.params;
  let voteChange = req.body.inc_votes;
  patchVotesById(article_id, voteChange)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentToArticleById = (req, res, next) => {
  let { article_id } = req.params;
  let commentData = req.body;
  createNewCommentByArticleId(article_id, commentData)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
