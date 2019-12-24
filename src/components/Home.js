import React, { Component } from "react";
import shortid from "shortid";

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>The Mind</h1>
        <form>
          <h2>Create new room</h2>
          <div>
            <label>Enter Username</label>
            <input type="text" name="username" />
          </div>
          <div>
            <input type="submit" value="Create Room" />
          </div>
        </form>
      </div>
    );
  }
}

export default Home;
