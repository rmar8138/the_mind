import React, { Component } from "react";
import axios from "axios";
import shortid from "shortid";

export class Home extends Component {
  createRoom = async e => {
    const roomid = shortid.generate();

    e.preventDefault();

    await axios.post("http://localhost:5000/api/room", { roomid });
    this.props.history.push(`/${roomid}`);
  };

  render() {
    return (
      <div>
        <h1>The Mind</h1>
        <form onSubmit={this.createRoom}>
          <button onClick={this.createRoom}>Create new Room</button>
        </form>
      </div>
    );
  }
}

export default Home;
