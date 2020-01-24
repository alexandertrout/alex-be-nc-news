const usersRouter = require("express").Router();
const { handle405s } = require("../errors/error-handlers");
const {
  getAllUsers,
  getUserByUsername
} = require("../controllers/users-controllers");

usersRouter
  .route("/")
  .get(getAllUsers)
  .all(handle405s);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405s);

module.exports = usersRouter;
