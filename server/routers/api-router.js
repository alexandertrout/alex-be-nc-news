const apiRouter = require("express").Router();
const express = require("express");
const { handle405s } = require("../errors/error-handlers");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");

apiRouter.get("/", (req, res) =>
  res.json({ msg: "endpoints endpoints endpoints" })
);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
