const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = require("./userSchema");

const roomSchema = new Schema({
  roomid: {
    type: String,
    required: true
  },
  gameStarted: {
    type: Boolean,
    required: true,
    default: false
  },
  users: [userSchema]
});

module.exports = roomSchema;
