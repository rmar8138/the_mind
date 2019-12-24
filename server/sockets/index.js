const _ = require("lodash");
const RoomModel = require("../database/models/RoomModel");

const socketInit = (io, socket) => {
  let round = 12;
  let room = null;
  socket.on("setRoom", roomid => {
    socket.join(roomid);
  });

  socket.on("joinRoom", async ({ roomid, username, socketid }) => {
    const newUser = {
      username: username,
      socketid: socketid
    };

    room = await RoomModel.findOne({ roomid: roomid });

    room.users.push(newUser);
    room.save();

    io.to(room.roomid).emit("updateUsers", room.users);
  });

  socket.on("startGame", () => {
    io.to(room.roomid).emit("startGame");
  });

  socket.on("setupGame", async numberOfUsers => {
    await room.updateOne({ gameStarted: true });

    // setup cards
    const numbers = _.range(1, 101);
    const cards = _.sampleSize(numbers, round * numberOfUsers).sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    console.log(cards);

    socket.emit("setupCards", cards);

    // assign cards
    const shuffledCards = _.shuffle(cards);
    // assign cards randomly to each user
    const userCards = _.chunk(shuffledCards, round);

    io.to(room.roomid).emit("setupGame", { cards, userCards, round });
  });

  // socket.on("setupCards", ({ round, numberOfUsers }) => {
  //   const numbers = _.range(1, 101);
  //   const cards = _.sampleSize(numbers, round * numberOfUsers).sort((a, b) => {
  //     if (a > b) return 1;
  //     if (a < b) return -1;
  //     return 0;
  //   });

  //   console.log(cards);

  //   socket.emit("setupCards", cards);
  // });

  socket.on("validCardPlayed", () => {
    io.to(room.roomid).emit("validCardPlayed");
  });

  socket.on("disconnect", () => {
    const userid = room.users.find(user => user.socketid === socket.id)._id;
    // delete user from room
    room.users.pull(userid);
    room.save();

    io.to(room.roomid).emit("updateUsers", room.users);
  });
};

module.exports = socketInit;
