import React, { Component } from "react";

export class Game extends Component {
  state = {
    round: null,
    cardsLeft: [],
    currentCardCount: 0,
    lastPlayedCard: null,
    gameOver: false,
    gameWon: false,
    users: []
  };

  async componentDidMount() {
    const { socket } = this.props;

    await socket.emit("setupGame", this.props.users.length);

    socket.on("setupGame", async ({ cards, userCards, round }) => {
      await this.setState(prevState => ({
        ...prevState,
        lastPlayedCard: null,
        currentCardCount: 0,
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

    socket.on("validCardPlayed", async () => {
      // update count for all players
      await this.setState(prevState => ({
        ...prevState,
        currentCardCount: (prevState.currentCardCount += 1)
      }));
    });

    socket.on("updateLastPlayedCard", async playedCard => {
      await this.setState(prevState => ({
        ...prevState,
        lastPlayedCard: playedCard
      }));
    });

    socket.on("gameWon", async () => {
      await this.setState(() => ({ gameWon: true }));
    });
  }

  checkValidCard = playedCard => {
    // add logic to check card
    const { cardsLeft, currentCardCount } = this.state;

    if (cardsLeft[currentCardCount] === playedCard) {
      return true;
    }

    return false;
  };

  playCard = async e => {
    const { round, cardsLeft, currentCardCount } = this.state;
    const { socket } = this.props;
    const playedCard = e.target.value;

    // update last played card
    this.updateLastPlayedCard(playedCard);

    // remove card from dom here
    await this.removeCard(playedCard);

    if (this.checkValidCard(playedCard)) {
      // correct card played
      console.log("correct card played!");

      // send socket event
      socket.emit("validCardPlayed");

      // check if cards remaining?
      if (cardsLeft.length - 1 === currentCardCount) {
        if (round === 12) {
          await this.gameWon();
        } else {
          console.log("next round bruh");
          this.nextRound();
        }
      }
    } else {
      // incorrect card played, handle this

      // disable click events??
      console.log("GAME OVER");
      this.setState(() => ({
        gameOver: true
      }));
    }
  };

  removeCard = async playedCard => {
    const { socket } = this.props;
    // remove last played card from users card array
    await this.setState(prevState => ({
      ...prevState,
      users: prevState.users.map(user => {
        if (user.socketid === socket.id) {
          return {
            ...user,
            cards: user.cards.filter(card => card !== playedCard)
          };
        }

        return user;
      })
    }));
  };

  updateLastPlayedCard = playedCard => {
    const { socket } = this.props;
    // send socket event
    socket.emit("updateLastPlayedCard", playedCard);
  };

  nextRound = async () => {
    const { socket } = this.props;

    // send nextRound socket event to update round
    await socket.emit("nextRound");

    // setup game/cards
    await socket.emit("setupGame", this.props.users.length);
  };

  gameWon = async () => {
    const { socket } = this.props;
    // send gameWon socket event

    socket.emit("gameWon");
  };

  render() {
    return (
      <div>
        <h1>THE GAME HAS STARTED</h1>
        {this.state.gameWon && <h2>You win! Congrats!</h2>}
        <h2>Round {this.state.round}</h2>
        <h2>Last card played: {this.state.lastPlayedCard}</h2>
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
