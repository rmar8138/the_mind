import React, { Component } from "react";
import socketClient from "socket.io-client";
import axios from "axios";

const endpoint = "http://localhost:5000";
let socket = null;

export class Room extends Component {
  state = {
    currentUser: "",
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
    console.log(roomData);

    // socket logic
    socket.on("updateUsers", data => {
      this.setState(() => ({
        users: data
      }));
    });
  }

  joinRoom = e => {
    const { roomid } = this.props.match.params;
    const username = e.target.elements.username.value;

    e.preventDefault();

    this.setState(() => ({ currentUser: username }));

    socket.emit("joinRoom", { roomid, username, socketid: socket.id });
  };

  render() {
    return this.state.currentUser ? (
      <div>
        <h1>{this.state.roomid}</h1>
        <ul>
          {this.state.users.map(user => (
            <li>{user.username}</li>
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <h1>pls enter name</h1>
        <form onSubmit={this.joinRoom}>
          <div>
            <label>Username</label>
            <input type="text" name="username" />
          </div>
          <input type="submit" value="Join room" />
        </form>
      </div>
    );
  }
}

export default Room;
