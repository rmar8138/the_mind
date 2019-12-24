const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  socketid: {
    type: String,
    required: true
  }
});

module.exports = userSchema;
