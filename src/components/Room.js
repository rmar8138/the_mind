import React, { Component } from "react";
import socketClient from "socket.io-client";
import axios from "axios";
import Lobby from "./Lobby";
import Game from "./Game";

const endpoint = "http://localhost:5000";
let socket = null;

export class Room extends Component {
  state = {
    currentUser: "",
    gameStarted: false,
    users: []
  };

  async componentDidMount() {
    const { roomid } = this.props.match.params;
    // establish socket connection
    socket = socketClient(endpoint, { roomid });
    socket.emit("setRoom", roomid);

    // query server for room to search for users
    const roomData = await axios.get(`${endpoint}/api/room?roomid=${roomid}`);
    this.setState(() => ({
      users: roomData.data.users
    }));

    // socket logic
    socket.on("updateUsers", data => {
      this.setState(() => ({
        users: data
      }));
    });

    socket.on("startGame", () => {
      this.setState(() => ({ gameStarted: true }));
    });
  }

  joinRoom = e => {
    const { roomid } = this.props.match.params;
    const username = e.target.elements.username.value;

    e.preventDefault();

    this.setState(() => ({ currentUser: username }));

    socket.emit("joinRoom", { roomid, username, socketid: socket.id });
  };

  startGame = () => {
    // send socket event that renders game component for all connected sockets
    socket.emit("startGame");
  };

  render() {
    return this.state.currentUser ? (
      this.state.gameStarted ? (
        <Game users={this.state.users} />
      ) : (
        <Lobby
          roomid={this.props.match.params.roomid}
          users={this.state.users}
          startGame={this.startGame}
        />
      )
    ) : (
      <div>
        <h1>pls enter name</h1>
        <form onSubmit={this.joinRoom}>
          <div>
            <label>Username</label>
            <input type="text" name="username" />
          </div>
          <button>Join Room</button>
        </form>
      </div>
    );
  }
}

export default Room;
