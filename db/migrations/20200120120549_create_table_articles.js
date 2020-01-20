exports.up = function(knex) {
  return knex.schema.createTable("articles", table => {
    table.increments("article_id").primary();
    table.string("title");
    table
      .string("topic")
      .references("slug")
      .inTable("topics");
    table
      .string("author")
      .references("username")
      .inTable("users");
    table.string("body");
    table.integer("votes").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
