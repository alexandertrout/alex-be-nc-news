const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const { handleCustoms, handle404sAnd400s } = require("./errors/error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustoms);
app.use(handle404sAnd400s);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Route!" });
});

module.exports = app;
