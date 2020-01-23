const connection = require("../../db/connection");

exports.fetchAllTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*")
    .then(topics => {
      return topics;
    });
};

exports.checkTopicExists = topic => {
  return connection("topics")
    .select("*")
    .where("slug", topic)
    .then(topic => {
      if (topic.length === 0)
        return Promise.reject({
          status: 400,
          msg: "invalid topic query - topic does not exist"
        });
    });
};
