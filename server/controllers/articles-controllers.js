const {
  fetchAllArticles,
  fetchArticleById,
  insertNewArticle,
  patchVotesById,
  removeArticleById,
  createNewCommentByArticleId,
  fetchCommentsById,
  checkArticleExists
} = require("../models/articles-models");
const { checkTopicExists } = require("../models/topics-models");
const { checkUserExists } = require("../models/users-models");

exports.getAllArticles = (req, res, next) => {
  let { sort_by, order, author, topic, limit } = req.query;
  let promiseArray = [fetchAllArticles(sort_by, order, author, topic)];
  if (topic !== undefined) promiseArray.push(checkTopicExists(topic));
  if (author !== undefined) promiseArray.push(checkUserExists(author));
  Promise.all(promiseArray)
    .then(returnArray => {
      // Not the best way to check for limit - need to use SQL pagination - p values is for offset

      // if (limit) {
      //   let limitNumber = parseInt(limit);
      //   let limitedArticles = [];
      //   for (let i = 0; i < limitNumber; i++) {
      //     limitedArticles.push(returnArray[0][i]);
      //   }
      //   res.status(200).send({
      //     articles: limitedArticles,
      //     total_count: returnArray[0].length
      //   });
      // } else {
      res.status(200).send({ articles: returnArray[0] });
      // }
    })
    .catch(next);
};

exports.postNewArticle = (req, res, next) => {
  let articleData = req.body;
  insertNewArticle(articleData)
    .then(article => {
      res.status(201).send({ article });
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
  if (voteChange === undefined) {
    fetchArticleById(article_id)
      .then(article => {
        res.status(200).send({ article });
      })
      .catch(next);
  } else {
    let promiseArray = [
      patchVotesById(article_id, voteChange),
      checkArticleExists(article_id)
    ];
    Promise.all(promiseArray)
      .then(articles => {
        res.status(200).send({ article: articles[0] });
      })
      .catch(next);
  }
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "non existent article_id" });
      res.sendStatus(204);
    })
    .catch(next);
};

exports.postCommentToArticleById = (req, res, next) => {
  let { article_id } = req.params;
  let commentData = req.body;
  createNewCommentByArticleId(article_id, commentData)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

//getCommentsByArticleId <--------  change name of this to make more sense phonetically
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
