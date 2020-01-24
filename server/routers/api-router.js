const apiRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const endpointsInfoString = require("../../endpoints-info");

// use a json instead of a stirng in the endpointsInfo
apiRouter.get("/", (req, res, next) => res.send({ msg: endpointsInfoString }));
// USe 405 handleer
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
