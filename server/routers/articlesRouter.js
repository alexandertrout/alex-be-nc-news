const articlesRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const {
  getAllArticles,
  postNewArticle,
  getArticleById,
  updateVotesById,
  deleteArticleById,
  postCommentToArticleById,
  getCommentsById
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postNewArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVotesById)
  .delete(deleteArticleById)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentToArticleById)
  .get(getCommentsById)
  .all(handle405s);

module.exports = articlesRouter;
