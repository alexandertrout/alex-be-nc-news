const connection = require("../../db/connection");

exports.fetchAllTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*")
    .then(topics => {
      console.log(topics);
      return topics;
    });
};
