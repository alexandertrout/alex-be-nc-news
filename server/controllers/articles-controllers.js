const {
  fetchAllArticles,
  fetchArticleById,
  patchVotesById,
  createNewCommentByArticleId,
  fetchCommentsById,
  checkArticleExists
} = require("../models/articles-models");
const { checkTopicExists } = require("../models/topics-models");
const { checkUserExists } = require("../models/users-models");

exports.getAllArticles = (req, res, next) => {
  let { sort_by, order, author, topic } = req.query;
  let promiseArray = [fetchAllArticles(sort_by, order, author, topic)];
  if (topic !== undefined) promiseArray.push(checkTopicExists(topic));
  if (author !== undefined) promiseArray.push(checkUserExists(author));

  Promise.all(promiseArray)
    .then(returnArray => {
      res.status(200).send({ articles: returnArray[0] });
    })
    .catch(next);
};

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

exports.getCommentsById = (req, res, next) => {
  let { article_id } = req.params;
  let { sort_by, order } = req.query;
  let promiseArray = [
    fetchCommentsById(article_id, sort_by, order),
    checkArticleExists(article_id)
  ];
  Promise.all(promiseArray)
    .then(returnArray => {
      res.status(200).send({ comments: returnArray[0] });
    })
    .catch(next);
};
