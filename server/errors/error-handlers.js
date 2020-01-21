exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed on that endpoint!" });
};

exports.handle400s = (err, req, res, next) => {
  const codes = ["22P02"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "invalid article_id" });
  } else next(err);
};
exports.handle404s = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(404).send({ msg: "valid but non-exisitent article_id" });
  } else next(err);
};

exports.handleCustoms = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
};
