import React, { Component } from "react";
import _ from "lodash";

export class Game extends Component {
  state = {
    round: 12,
    cardsLeft: [],
    users: []
  };

  async componentDidMount() {
    const { socket } = this.props;

    // set up users
    await this.setState(() => ({
      users: this.props.users.map(user => ({
        ...user,
        cards: []
      }))
    }));

    // initialize cards
    await this.setupCards();
  }

  setupCards = () => {
    const { round, users } = this.state;
    // push round * no. of users amount of integers between 1-100
    const numbers = _.range(1, 101);
    const cards = _.sampleSize(numbers, round * users.length).sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    return this.setState(() => ({ cardsLeft: cards }));
  };

  render() {
    return (
      <div>
        <h1>THE GAME HAS STARTED</h1>
        <ul>
          {this.props.users.map(user => (
            <li key={user.socketid}>{user.username}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Game;
