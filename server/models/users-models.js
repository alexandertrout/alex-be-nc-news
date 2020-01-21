const connection = require("../../db/connection");

exports.fetchUserByUsername = username => {
  return connection("users")
    .where("username", username)
    .returning("*")
    .then(users => {
      if (users.length === 0)
        return Promise.reject({
          status: 404,
          msg: "valid but non existent"
        });
      else return users[0];
    });
};
