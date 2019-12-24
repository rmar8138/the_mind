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

    // assign cards
    await this.assignCards();
  }

  gameInit = () => {};

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

  assignCards = () => {
    const { cardsLeft, round } = this.state;
    const shuffledCards = _.shuffle(cardsLeft);
    // assign cards randomly to each user
    const userCards = _.chunk(shuffledCards, round);

    return this.setState(prevState => ({
      ...prevState,
      users: prevState.users.map((user, index) => ({
        ...user,
        cards: userCards[index].sort((a, b) => {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        })
      }))
    }));
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
        {this.state.users.length && (
          <ul>
            {this.state.users
              .find(user => user.socketid === this.props.socket.id)
              .cards.map(card => (
                <li key={card}>{card}</li>
              ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Game;
