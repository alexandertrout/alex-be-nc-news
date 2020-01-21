exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed on that endpoint!" });
};

exports.handleCustoms = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle404sAnd400s = (err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send(err.message);
  else next(err);
};
