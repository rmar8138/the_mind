import React, { Component } from "react";
import styled from "styled-components";
import { Container } from "./styles/Container";
import { Button } from "./styles/Button";

const GameContainer = styled(Container)`
  justify-content: space-between;
`;

const Players = styled.ul`
  list-style: none;
`;

const GameBoard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center;
  align-items: center;
  justify-content: space-evenly;

  h1 {
    font-size: 6rem;
  }

  h2 {
  }

  span {
    border: 1px solid white;
    border-radius: 10px;
    padding: 4rem 2rem;
    display: flex-inline;
    justify-content: center;
    align-items: center;
  }
`;

const Cards = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row-reverse;
  overflow: scroll;

  li {
    border: 1px solid white;
    border-radius: 10px;
    padding: 4rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li:not(:last-child) {
    margin-left: 1rem;
  }
`;

const FinishedGameMenu = styled.div`
  h2 {
    margin-bottom: 2rem;
  }

  button:not(:last-child) {
    margin-right: 2rem;
  }
`;

export class Game extends Component {
  state = {
    round: 1,
    cardsLeft: [],
    currentCardCount: 0,
    lastPlayedCard: {
      card: null,
      username: null
    },
    gameOver: false,
    gameWon: false,
    users: []
  };

  async componentDidMount() {
    const { socket } = this.props;

    await socket.emit("setupGame", this.props.users.length, this.state.round);

    socket.on("setupGame", async ({ cards, userCards }) => {
      console.log(this.state.round);
      await this.setState(prevState => ({
        ...prevState,
        lastPlayedCard: {
          card: null,
          username: null
        },
        currentCardCount: 0,
        cardsLeft: cards,
        gameOver: false,
        gameWon: false,
        users: this.props.users.map((user, index) => ({
          ...user,
          cards: userCards[index].sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
          })
        }))
      }));
      console.log(this.state.round);
    });

    socket.on("validCardPlayed", async (socketid, playedCard) => {
      // update count for all players
      await this.setState(prevState => ({
        ...prevState,
        users: prevState.users.map(user => {
          if (user.socketid === socketid) {
            return {
              ...user,
              cards: user.cards.filter(card => card !== playedCard)
            };
          }

          return user;
        })
      }));
    });

    socket.on("updateLastPlayedCard", async (playedCard, currentUser) => {
      await this.setState(prevState => ({
        ...prevState,
        currentCardCount: (prevState.currentCardCount += 1),
        lastPlayedCard: {
          card: playedCard,
          username: currentUser
        }
      }));
    });

    socket.on("gameWon", async () => {
      await this.setState(() => ({ gameWon: true }));
    });

    socket.on("nextRound", async () => {
      await this.setState(prevState => ({
        ...prevState,
        round: (prevState.round += 1)
      }));
    });

    socket.on("resetRoundCount", async () => {
      await this.setState(() => ({
        round: 1
      }));
    });

    socket.on("gameOver", () => {
      this.setState(() => ({
        gameOver: true
      }));
    });

    socket.on("exitGame", () => {
      this.props.history.replace({
        pathname: "/",
        state: null
      });
    });

    socket.on("userDisconnect", () => {
      // when user disconnects during in progress game,
      // redirect everyone back to home with
      // error message
      socket.emit("exitGame");
      return this.props.history.replace({
        pathname: "/",
        state: {
          error: "A user has disconnected"
        }
      });
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
      socket.emit("validCardPlayed", socket.id, playedCard);

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
      socket.emit("gameOver");
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
    socket.emit("updateLastPlayedCard", playedCard, this.props.currentUser);
  };

  nextRound = async () => {
    const { socket } = this.props;

    // send nextRound socket event to update round
    await socket.emit("nextRound");

    console.log(this.state.round);
    // setup game/cards
    await socket.emit(
      "setupGame",
      this.props.users.length,
      this.state.round + 1
    );
  };

  gameWon = async () => {
    const { socket } = this.props;
    // send gameWon socket event

    socket.emit("gameWon");
  };

  resetGame = () => {
    const { socket } = this.props;
    socket.emit("resetRoundCount");
    socket.emit("setupGame", this.props.users.length, 1);
  };

  exitGame = () => {
    const { socket } = this.props;

    // delete room and redirect
    socket.emit("exitGame");
  };

  render() {
    return (
      <GameContainer>
        <Players>
          {this.state.users.map(user => (
            <li key={user.socketid}>
              {user.username} - {user.cards.length} card(s) left
            </li>
          ))}
        </Players>
        <GameBoard>
          {this.state.gameWon || this.state.gameOver ? (
            <FinishedGameMenu>
              <h2>
                {this.state.gameWon && "You win!"}
                {this.state.gameOver && "You lose..."}
              </h2>
              <Button onTap={this.resetGame}>Play again</Button>
              <Button onTap={this.exitGame}>Exit</Button>
            </FinishedGameMenu>
          ) : (
            <h1>Round {this.state.round}</h1>
          )}
          {!!this.state.currentCardCount && (
            <>
              <h2>{this.state.lastPlayedCard.username} played...</h2>
              <span>{this.state.lastPlayedCard.card}</span>
            </>
          )}
        </GameBoard>
        {this.state.users.length && (
          <Cards>
            {this.state.users
              .find(user => user.socketid === this.props.socket.id)
              .cards.map(card => (
                <li key={card} onClick={this.playCard} value={card}>
                  {card}
                </li>
              ))}
          </Cards>
        )}
      </GameContainer>
    );
  }
}

export default Game;
