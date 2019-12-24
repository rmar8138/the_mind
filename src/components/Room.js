import React, { Component } from "react";
import socketClient from "socket.io-client";
import axios from "axios";

const endpoint = "http://localhost:5000/";
let socket = null;

export class Room extends Component {
  state = {
    users: []
  };

  async componentDidMount() {
    // check if room exists
    // const room = await axios.get()

    // push user to users
    // socket logic here

    socket = socketClient(endpoint);
    socket.emit("message", "hello from the client");
  }

  render() {
    return <div>{this.props.match.params.room}</div>;
  }
}

export default Room;
