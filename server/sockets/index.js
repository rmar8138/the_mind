const socketInit = (io, socket) => {
  socket.on("message", data => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("user has disconnected");
  });
};

module.exports = socketInit;
