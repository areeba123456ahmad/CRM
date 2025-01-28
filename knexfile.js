export default {
  development: {
    client: "mysql2", // Use your database client
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "1234",
      database: "ClientRMl",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
