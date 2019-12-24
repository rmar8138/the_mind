import React, { Component } from "react";
import { Link } from "react-router-dom";
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
          >
            Create room
          </Link>
        </form>
      </div>
    );
  }
}

export default Home;
