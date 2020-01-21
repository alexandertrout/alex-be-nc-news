const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handle400s,
  handleCustoms,
  handle500s
} = require("./errors/error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400s);
app.use(handleCustoms);
app.use(handle500s);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Route!" });
});

module.exports = app;
