import React, { Component } from "react";
import socketClient from "socket.io-client";
import axios from "axios";

const endpoint = "http://localhost:5000";
let socket = null;

export class Room extends Component {
  state = {
    currentUser: this.props.location.state,
    roomid: "",
    users: []
  };

  async componentDidMount() {
    // if (!this.props.location.state.roomid) {
    //   console.log("redirect here");
    // }
    const { roomid } = this.props.match.params;
    console.log(roomid);
    // check if room exists
    const roomExists = await axios.get(`${endpoint}/api/room?roomid=${roomid}`);

    // push user to users
    this.setState(() => ({
      roomid: roomExists.data.roomid,
      users: roomExists.data.users
    }));

    // socket logic here
    socket = socketClient(endpoint);
    socket.emit("message", "hello from the client");
  }

  joinRoom = e => {
    const username = e.target.elements.username;
    e.preventDefault();
    this.setState(() => ({ currentUser: username }));
    //socket logic here for new user
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
