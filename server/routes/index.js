const express = require("express");
const cors = require("cors");
const router = express.Router();
const RoomModel = require("../database/models/RoomModel");

// enable cors
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.post("/api/room/new", async (req, res) => {
  // create new room
  const { username, room, socketid } = req.body;

  const newRoom = await RoomModel.create({
    roomid: room
  });

  newRoom.users.push({
    username,
    socketid
  });

  newRoom.save();

  res.json(newRoom);
});

module.exports = router;
