const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

mongoose.connect(`mongodb://localhost/sockets-chat`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set promise library

mongoose.Promise = global.Promise;
mongoose.connection.on("error", err => console.log(err));

app.use(routes);

module.exports = app;
