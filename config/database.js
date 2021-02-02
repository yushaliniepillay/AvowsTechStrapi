const parse =
  process.env.NODE_ENV === "development"
    ? () => ""
    : require("pg-connection-string").parse;
const config = parse(process.env.DATABASE_URL);

const devConnections = (env) => {
  return {
    default: {
      connector: "bookshelf",
      settings: {
        client: "sqlite",
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  };
};

const productionConnections = (env) => {
  return {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.user,
        password: config.password,
      },
      options: {
        ssl: false,
      },
    },
  };
};

module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections:
    env("NODE_ENV") === "development"
      ? devConnections(env)
      : productionConnections(env),
});
