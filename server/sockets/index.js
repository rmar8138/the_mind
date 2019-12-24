const socketInit = (io, socket) => {
  socket.on("disconnect", () => {
    console.log("user has disconnected");
  });
};

module.exports = socketInit;
