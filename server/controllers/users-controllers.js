const {
  fetchAllUsers,
  fetchUserByUsername
} = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchAllUsers(sort_by, order)
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
