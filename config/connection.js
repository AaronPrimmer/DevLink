const { connect, connection } = require("mongoose");
require("dotenv").config();

connect(
  process.env.DB_URL ||
    `mongodb://${process.env.DB_USER || ""}${process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}@` : ""}localhost:27017/${process.env.DB_NAME || "devlink"}`,
).catch((err) => console.error(err));

module.exports = connection;
