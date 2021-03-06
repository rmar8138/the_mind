const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");
const routes = require("./routes");

const app = express();
const db = process.env.MONGODB_URI || "mongodb://localhost/the_mind";

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set promise library

mongoose.Promise = global.Promise;
mongoose.connection.on("error", err => console.log(err));

app.use(history());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "./../build/")));

app.use(routes);

module.exports = app;
