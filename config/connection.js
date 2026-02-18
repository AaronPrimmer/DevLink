const { connect, connection } = require("mongoose");

connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/devlink").catch(
  (err) => console.error(err),
);

module.exports = connection;
