exports.up = function(knex) {
  return knex.schema.createTable("comments", table => {
    table.increments("table_id").primary();
    table
      .text("author")
      .references("username")
      .inTable("users");
    table
      .integer("article_id")
      .references("article_id")
      .inTable("articles");
    table.integer("votes").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.text("body");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
