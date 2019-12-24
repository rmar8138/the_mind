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

router.get("/api/room", async (req, res) => {
  const { roomid } = req.query;
  console.log(roomid);

  const roomExists = await RoomModel.findOne({ roomid: roomid });
  res.json(roomExists);
});

router.post("/api/room", async (req, res) => {
  // create new room
  const { username, roomid, socketid } = req.body;

  const newRoom = await RoomModel.create({ roomid });

  newRoom.users.push({
    username,
    socketid
  });

  newRoom.save();

  res.json(newRoom);
});

module.exports = router;
