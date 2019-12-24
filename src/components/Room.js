import React, { Component } from "react";
import socketClient from "socket.io-client";
import axios from "axios";

const endpoint = "http://localhost:5000";
let socket = null;

export class Room extends Component {
  state = {
    roomid: "",
    users: []
  };

  async componentDidMount() {
    if (!this.props.location.state.roomid) {
      console.log("redirect here");
    }
    const { roomid } = this.props.location.state;
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

  render() {
    return (
      <div>
        <h1>{this.state.roomid}</h1>
        <ul>
          {this.state.users.map(user => (
            <li>{user.username}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Room;
