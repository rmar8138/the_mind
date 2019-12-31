const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "./../build/static")));

app.use(routes);

app.get("*", (req, res) => {
  res.sendfile(path(__dirname + "./../build/index.html"));
});

module.exports = app;
