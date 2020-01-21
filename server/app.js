const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {} = require("./errors/error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Route!" });
});

module.exports = app;
