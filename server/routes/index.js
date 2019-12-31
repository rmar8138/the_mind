const express = require("express");
const path = require("path");
const router = express.Router();
const RoomModel = require("../database/models/RoomModel");

// enable cors
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
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
  const { roomid } = req.body;

  const newRoom = await RoomModel.create({ roomid });

  res.json(newRoom);
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../../build/index.html"));
});

module.exports = router;
