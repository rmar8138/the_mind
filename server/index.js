const app = require("./app");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const socketInit = require("./sockets");
const port = process.env.PORT || 5000;

io.on("connection", socket => {
  socketInit(io, socket);
});

http.listen(port, () => console.log(`Server listening on port ${port}`));
