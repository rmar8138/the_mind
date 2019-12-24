import React, { Component } from "react";

export class Game extends Component {
  render() {
    return (
      <div>
        <h1>THE GAME HAS STARTED</h1>
        <ul>
          {this.props.users.map(user => (
            <li key={user.socketid}>{user.username}</li>
          ))}
        </ul>
        <button onClick={this.props.startGame}>Start game</button>
      </div>
    );
  }
}

export default Game;
