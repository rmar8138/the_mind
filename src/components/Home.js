import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import shortid from "shortid";

const room = shortid.generate();

export class Home extends Component {
  state = {
    username: "",
    room
  };

  handleInputChange = e => {
    const username = e.target.value;
    this.setState(() => ({ username }));
  };

  createRoom = async () => {
    const { username, room } = this.state;
    const newRoom = await axios.post("http://localhost:5000/api/room/new", {
      username,
      room
    });
    console.log(newRoom);
  };

  render() {
    return (
      <div>
        <h1>The Mind</h1>
        <form>
          <h2>Create new room</h2>
          <div>
            <label>Enter Username</label>
            <input
              type="text"
              name="username"
              onChange={this.handleInputChange}
            />
          </div>
          <Link
            to={{
              pathname: `/${room}`,
              state: {
                username: this.state.username
              }
            }}
            onClick={this.createRoom}
          >
            Create room
          </Link>
        </form>
      </div>
    );
  }
}

export default Home;
