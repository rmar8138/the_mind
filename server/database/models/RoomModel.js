const mongoose = require("mongoose");
const roomSchema = require("../schemas/roomSchema");

const RoomModel = mongoose.model("room", roomSchema);

module.exports = RoomModel;
