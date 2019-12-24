const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io").listen(server);
const socketInit = require("./sockets");
const port = process.env.PORT || 5000;

io.on("connection", socket => {
  socketInit(io, socket);
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
