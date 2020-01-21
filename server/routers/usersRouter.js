const usersRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const { getUserByUsername } = require("../controllers/users-controllers");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405s);

module.exports = usersRouter;
