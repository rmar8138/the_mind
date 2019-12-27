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
    loading: true,
    users: []
  };

  async componentDidMount() {
    const { roomid } = this.props.match.params;

    // query server for room to search for users
    const roomData = await axios.get(`${endpoint}/api/room?roomid=${roomid}`);
    this.setState(() => ({
      users: roomData.data.users,
      gameStarted: roomData.data.gameStarted
    }));

    // redirect if game has already started
    if (this.state.gameStarted) {
      console.log("HEY THE GAME HAS ALREADY STARTED");

      // redirec with messagw
      return this.props.history.replace({
        pathname: "/",
        state: {
          error: "Game has already started"
        }
      });
    }

    // redirect if game already has 4 players
    if (this.state.users.length === 4) {
      console.log("ROOM IS FULL");

      // redirect with message
      return this.props.history.replace("/");
    }

    // change loading state
    this.setState(() => ({ loading: false }));

    // establish socket connection
    socket = socketClient(endpoint, { roomid });
    socket.emit("setRoom", roomid);

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
    return this.state.loading ? (
      <h1>LOADING</h1>
    ) : this.state.currentUser ? (
      this.state.gameStarted ? (
        <Game users={this.state.users} socket={socket} />
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
