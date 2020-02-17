# NC News Backend Express Server

A RESTful server built using express, knex and axios. Gives access to databases containing articles, comments, topics and users. Used with (INSERT FRONT END LINK HERE) to create a reddit-style news site.

##### Hosted on heroku at https://alex-be-nc-news.herokuapp.com/api

## Installation and Locally Hosting

After Cloning this repo cd into the server directory before running the listen.js file using node:

```zsh
npm install
cd server
node listen.js
```

# Avaliable Endpoints

## Avaliable Endpoints - GET ALL

### GET - /api/topics

Responds with an **array** of topic objects. (All Topics).
On key of 'topics'.

https://alex-be-nc-news.herokuapp.com/api/topics

### GET -api/users/

Responds with an **array** of user objects. (All Users). On key of 'users'.

https://alex-be-nc-news.herokuapp.com/api/users

### GET -api/articles/

Responds with an **array** of article objects. (All Articles). On key of 'articles'.

https://alex-be-nc-news.herokuapp.com/api/articles

##### Accepts queries

- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `author`, which filters the articles by the username value specified in the query
- `topic`, which filters the articles by the topic value specified in the query

## Avaliable Endpoints - USERS

### GET -api/users/:username

Responds with an a **single user object**. On key of 'user'.

https://alex-be-nc-news.herokuapp.com/api/users/grumpy19

## Avaliable Endpoints - ARTICLES

### GET - api/articles/:article_id

Responds with an a **single article object**. On key of 'article'.

https://alex-be-nc-news.herokuapp.com/api/articles/33

### PATCH /api/articles/:article_id

Responds with an a **single article object**, which has been amended.  
On key of 'article'.

request body: { "inc_votes": 10 } OR { "inc_votes": -10 }

https://alex-be-nc-news.herokuapp.com/api/articles/33

## Avaliable Endpoints - COMMENTS

### GET - api/articles/:article_id/comments

Responds with an an **array** of comments for that article. On key of 'comments.

https://alex-be-nc-news.herokuapp.com/api/articles/33/comments

##### Accepts queries

- `sort_by`, which sorts the comments by any valid column (defaults to created_at)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

### POST /api/articles/:article_id/comments

Responds with an a **single comment object**, which has been posted.
On key of 'comment'.

request body: { "username": "cooljmessy", "body": "This is a TEST comment" }

https://alex-be-nc-news.herokuapp.com/api/articles/33/comments

### DELETE /api/comments/:comment_id

Responds with nothing, deletes comment by id.

https://alex-be-nc-news.herokuapp.com/api/comments/196

### PATCH /api/comments/:comment_id

Responds with an a **single comment object**, which has been amended.
On key of 'comment'.

request body: { "inc_votes": 10 } OR { "inc_votes": -10 }

https://alex-be-nc-news.herokuapp.com/api/comments/196

## Running the Tests

Testing for each endpoint was achieved using mocha and chai, to run the test file (app.spec.js):

```zsh
npm install
npm t
```
