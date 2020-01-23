exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed on that endpoint!" });
};

exports.handleCustoms = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handle400s = (err, req, res, next) => {
  const codes = ["22P02"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "invalid id" });
  }
  next(err);
};
exports.handle404s = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(404).send({ msg: "valid but non-exisitent" });
  }
  next(err);
};

exports.handle422s = (err, req, res, next) => {
  const codes = ["42703"];
  if (codes.includes(err.code)) {
    res.status(422).send({ msg: "invalid query" });
  }
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error!" });
};
