const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    client: "pg",
    connection: {
      database: "nc_news"
    }
  },
  test: {
    client: "pg",
    connection: {
      database: "nc_news_test"
    }
  }
};

module.exports = customConfig[ENV];
// module.exports = { ...customConfig[ENV], ...baseConfig };
