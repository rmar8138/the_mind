const _ = require("lodash");
const RoomModel = require("../database/models/RoomModel");

const sockets = [];

const socketInit = (io, socket) => {
  let room = { users: [] };
  let roomidReference = null;

  // push socket id to array
  sockets.push(socket.id);

  socket.on("setRoom", roomid => {
    roomidReference = roomid;
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
  socket.on("setupGame", async (numberOfUsers, round) => {
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

    io.to(room.roomid).emit("setupGame", { cards, userCards });
  });

  // send valid card played to all sockets
  socket.on("validCardPlayed", (socketid, playedCard) => {
    io.to(room.roomid).emit("validCardPlayed", socketid, playedCard);
  });

  // update last played card state for all sockets
  socket.on("updateLastPlayedCard", (playedCard, currentUser) => {
    io.to(room.roomid).emit("updateLastPlayedCard", playedCard, currentUser);
  });

  socket.on("nextRound", () => {
    // increment round
    io.to(room.roomid).emit("nextRound");
  });

  socket.on("gameWon", () => {
    io.to(room.roomid).emit("gameWon");
  });

  socket.on("resetRoundCount", () => {
    io.to(room.roomid).emit("resetRoundCount");
  });

  socket.on("gameOver", () => {
    io.to(room.roomid).emit("gameOver");
  });

  socket.on("exitGame", async () => {
    await RoomModel.findOneAndDelete({
      roomid: roomidReference
    });
    io.to(room.roomid).emit("exitGame");
  });

  // CLEAN THIS UP ITS GROSS //
  socket.on("disconnect", async () => {
    // this is for when user disconnects during game in progress
    io.to(room.roomid).emit("userDisconnect");

    if (room.users.length) {
      // delete user from room
      try {
        const userid = room.users.find(user => user.socketid === socket.id)._id;
        room.users.pull(userid);
        room.save();
      } catch (error) {
        console.log(error);
      }

      // delete room if no users
      if (room.users.length <= 0) {
        console.log("this ran");
        const deleted = await RoomModel.findOneAndDelete({
          roomid: roomidReference
        });
        return console.log(deleted);
      }

      io.to(room.roomid).emit("updateUsers", room.users);
    } else {
      // room hasnt been saved to socket, meaning user has closed room
      // before entering user name. delete room in this case

      if (room.users.length <= 0) {
        console.log("this ran");
        const deleted = await RoomModel.findOneAndDelete({
          roomid: roomidReference
        });
        return console.log(deleted);
      }
    }
  });
};

module.exports = socketInit;
