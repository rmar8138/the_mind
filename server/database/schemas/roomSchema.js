const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = require("./userSchema");

const roomSchema = new Schema({
  roomid: {
    type: String,
    required: true
  },
  users: [userSchema]
});

module.exports = roomSchema;
