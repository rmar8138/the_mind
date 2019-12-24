import React, { Component } from "react";
import _ from "lodash";

export class Game extends Component {
  state = {
    round: 12,
    cardsLeft: [],
    currentCardCount: 0,
    gameOver: false,
    users: []
  };

  async componentDidMount() {
    const { socket } = this.props;

    await socket.emit("setupGame", this.props.users.length);

    socket.on("setupGame", async ({ cards, userCards, round }) => {
      await this.setState(prevState => ({
        ...prevState,
        round,
        cardsLeft: cards,
        users: this.props.users.map((user, index) => ({
          ...user,
          cards: userCards[index].sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
          })
        }))
      }));
    });

    // socket.on("validCardPlayed", async () => {
    //   console.log("yay");
    //   // update count for all players
    //   await this.setState(prevState => ({
    //     ...prevState,
    //     currentCardCount: (prevState.currentCardCount += 1)
    //   }));
    // });

    // // set up users
    // await this.setState(() => ({
    //   users: this.props.users.map(user => ({
    //     ...user,
    //     cards: []
    //   }))
    // }));

    // // initialize cards
    // await this.setupCards();

    // // assign cards
    // await this.assignCards();
  }

  gameInit = () => {};

  setupCards = () => {
    const { socket } = this.props;
    const { round } = this.state;
    const numberOfUsers = this.state.users.length;

    // socket event

    socket.emit("setupCards", { round, numberOfUsers });

    return socket.on("setupCards", async cards => {
      await this.setState(() => ({ cardsLeft: cards }));
    });
  };

  assignCards = () => {
    const { cardsLeft, round } = this.state;
    const shuffledCards = _.shuffle(cardsLeft);
    // assign cards randomly to each user
    const userCards = _.chunk(shuffledCards, round);
    console.log(userCards);

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

  checkValidCard = playedCard => {
    // add logic to check card
    const { cardsLeft, currentCardCount } = this.state;

    if (cardsLeft[currentCardCount] === playedCard) {
      return true;
    }

    return false;
  };

  playCard = async e => {
    const { socket } = this.props;
    const playedCard = e.target.value;

    if (this.checkValidCard(playedCard)) {
      // correct card played
      console.log("correct card played!");

      // send socket event
      socket.emit("validCardPlayed");

      // remove card from dom here
    } else {
      // incorrect card played, handle this
      console.log("GAME OVER");
      this.setState(() => ({
        gameOver: true
      }));
    }
  };

  render() {
    return (
      <div>
        <h1>THE GAME HAS STARTED</h1>
        <h2>Last card played: {this.state.lastCardPlayed}</h2>
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
                <li key={card} onClick={this.playCard} value={card}>
                  {card}
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Game;
