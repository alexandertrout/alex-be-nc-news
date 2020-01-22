const articlesRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const {
  getAllArticles,
  getArticleById,
  updateVotesById,
  postCommentToArticleById,
  getCommentsById
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVotesById)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentToArticleById)
  .get(getCommentsById)
  .all(handle405s);

module.exports = articlesRouter;
