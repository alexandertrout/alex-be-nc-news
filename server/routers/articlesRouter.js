const articlesRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const { getArticleById } = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch()
  .all(handle405s);

module.exports = articlesRouter;
