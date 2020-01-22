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

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("topic", "=", topic);
    })
    .orderBy(sort_by, order)
    .then(articles => {
      if (articles.length === 0)
        return Promise.reject({
          status: 422,
          msg: "invalid query on the request"
        });
      const newArticles = articles.map(article => {
        let newCommentCount = parseInt(article.comment_count);
        article.comment_count = newCommentCount;
        return article;
      });
      return newArticles;
    });
};

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

exports.patchVotesById = (article_id, voteChange) => {
  if (typeof voteChange !== "number" || voteChange === null || voteChange === 0)
    return Promise.reject({
      status: 400,
      msg: "invalid data type in the request body"
    });
  return connection("articles")
    .where("article_id", article_id)
    .returning("*")
    .then(article => {
      if (article.length === 0)
        return Promise.reject({
          status: 404,
          msg: "valid but non existent article_id"
        });
      article[0].votes += voteChange;
      return connection("articles")
        .where("article_id", article_id)
        .update(article[0])
        .returning("*");
    })
    .then(patchedArticle => {
      return patchedArticle[0];
    });
};

exports.createNewCommentByArticleId = (article_id, commentData) => {
  if (
    typeof commentData.body !== "string" ||
    typeof commentData.username !== "string"
  )
    return Promise.reject({
      status: 400,
      msg: "invalid data type in the request body"
    });
  else
    return connection("users")
      .where("username", commentData.username)
      .returning("*")
      .then(users => {
        if (users.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "invalid username in the request body"
          });
        }
      })
      .then(() => {
        return connection("articles")
          .where("article_id", article_id)
          .returning("*")
          .then(article => {
            if (article.length === 0)
              return Promise.reject({
                status: 404,
                msg: "valid but non-exisitent article_id"
              });
            //above is checking if all parameters are okay, below is preperation and insertion of the comment into comments.
            else commentData.article_id = article_id;
            commentData.author = commentData.username;
            delete commentData.username;
            return connection("comments")
              .insert(commentData)
              .returning("*")
              .then(insertedComments => {
                return insertedComments[0];
              });
          });
      });
};

exports.fetchCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .returning("*")
    .orderBy(sort_by, order)
    .then(comments => {
      if (comments.length === 0)
        return Promise.reject({
          status: 404,
          msg: "valid but non-exisitent article_id"
        });
      return comments;
    });
};
