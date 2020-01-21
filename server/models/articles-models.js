const connection = require("../../db/connection");

// exports.fetchArticleById = article_id => {
//   return connection("articles")
//     .where("article_id", article_id)
//     .returning("*")
//     .then(articles => {
//       connection("comments")
//         .where("article_id", article_id)
//         .returning("*")
//         .then(comments => {
//           console.log(articles);
//           console.log(comments.length);
//         });
//     });
// };

// Refactored below to use Promise.all();

exports.fetchArticleById = article_id => {
  const promise1 = connection("articles")
    .where("article_id", article_id)
    .returning("*");
  const promise2 = connection("comments")
    .where("article_id", article_id)
    .returning("*");

  return Promise.all([promise1, promise2]).then(articleAndComments => {
    if (articleAndComments[0].length === 0) {
      return Promise.reject({
        status: 404,
        msg: "valid but non existent article_id"
      });
    } else {
      articleAndComments[0][0].comment_count = articleAndComments[1].length;
      return articleAndComments[0][0];
    }
  });
};
