exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed on that endpoint!" });
};
