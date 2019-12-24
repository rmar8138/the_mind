import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import shortid from "shortid";

const roomid = shortid.generate();

export class Home extends Component {
  state = {
    username: "",
    roomid
  };

  handleInputChange = e => {
    const username = e.target.value;
    this.setState(() => ({ username }));
  };

  createRoom = async e => {
    const { username, roomid } = this.state;
    e.preventDefault();
    const newRoom = await axios.post("http://localhost:5000/api/room", {
      username,
      roomid
    });
    console.log(newRoom);
    this.props.history.push({
      pathname: `/${roomid}`,
      state: {
        username,
        roomid
      }
    });
  };

  render() {
    return (
      <div>
        <h1>The Mind</h1>
        <form onSubmit={this.createRoom}>
          <h2>Create new room</h2>
          <div>
            <label>Enter Username</label>
            <input
              type="text"
              name="username"
              onChange={this.handleInputChange}
            />
          </div>
          {/* <Link
            to={{
              pathname: `/${room}`,
              state: {
                username: this.state.username
              }
            }}
            onClick={this.createRoom}
          >
            Create room
          </Link> */}
          <input type="submit" value="Create Room" />
        </form>
      </div>
    );
  }
}

export default Home;
