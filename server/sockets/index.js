const _ = require("lodash");
const RoomModel = require("../database/models/RoomModel");

const socketInit = (io, socket) => {
  let round = 12;
  let room = null;

  socket.on("setRoom", roomid => {
    socket.join(roomid);
  });

  // push user to room in db and update for all sockets
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

  // update start game state to render game component for all sockets
  socket.on("startGame", () => {
    io.to(room.roomid).emit("startGame");
  });

  // setup cards for all sockets
  socket.on("setupGame", async numberOfUsers => {
    await room.updateOne({ gameStarted: true });

    // setup cards
    const numbers = _.range(1, 101);
    const cards = _.sampleSize(numbers, round * numberOfUsers).sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    socket.emit("setupCards", cards);

    // assign cards
    const shuffledCards = _.shuffle(cards);
    // assign cards randomly to each user
    const userCards = _.chunk(shuffledCards, round);

    io.to(room.roomid).emit("setupGame", { cards, userCards, round });
  });

  // send valid card played to all sockets
  socket.on("validCardPlayed", () => {
    io.to(room.roomid).emit("validCardPlayed");
  });

  // update last played card state for all sockets
  socket.on("updateLastPlayedCard", playedCard => {
    io.to(room.roomid).emit("updateLastPlayedCard", playedCard);
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
