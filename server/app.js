const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handle400s,
  handle404s,
  handle422s,
  handleCustoms,
  handle500s
} = require("./errors/error-handlers");

app.use(express.json());

//app.use("/api", apiRouter);

app.use(handleCustoms);
app.use(handle400s);
app.use(handle404s);
app.use(handle422s);
app.use(handle500s);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Route!" });
});

module.exports = app;
