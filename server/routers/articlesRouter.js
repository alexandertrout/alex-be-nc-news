const articlesRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const {
  getArticleById,
  updateVotesById,
  postCommentToArticleById
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVotesById)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentToArticleById)
  .all(handle405s);

module.exports = articlesRouter;
