const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

mongoose.connect(`mongodb://localhost/the_mind`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set promise library

mongoose.Promise = global.Promise;
mongoose.connection.on("error", err => console.log(err));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(routes);

module.exports = app;
