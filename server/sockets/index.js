const RoomModel = require("../database/models/RoomModel");

const socketInit = (io, socket) => {
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

  socket.on("startGame", data => {
    console.log(data);

    io.to(room.roomid).emit("startGame");
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
