const connection = require("../../db/connection");

exports.fetchAllUsers = (sort_by = "username", order = "asc") => {
  return connection("users")
    .select("*")
    .orderBy(sort_by, order);
};

exports.fetchUserByUsername = username => {
  return connection("users")
    .where("username", username)
    .returning("*")
    .then(users => {
      if (users.length === 0)
        return Promise.reject({
          status: 404,
          msg: "valid but non existent username"
        });
      else return users[0];
    });
};

exports.checkUserExists = username => {
  return connection("users")
    .where("username", username)
    .returning("*")
    .then(users => {
      if (users.length === 0)
        return Promise.reject({
          status: 404,
          msg: "user does not exist"
        });
    });
};
