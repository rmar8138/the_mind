import React, { Component } from "react";
import styled from "styled-components";
import { Container } from "./styles/Container";
import { Button } from "./styles/Button";

const LobbyContainer = styled(Container)`
  justify-content: space-between;

  .heading {
    text-align: center;

    h1 {
      font-size: 2.4rem;
      word-break: break-word;
    }

    span {
      display: inline-block;
      margin: 2rem 0 4rem 0;
    }
  }

  ol {
    height: 100%;
    justify-self: flex-start;
    font-size: 2.4rem;
    list-style: none;
    li {
      padding: 1rem;
    }
  }
`;

export class Lobby extends Component {
  render() {
    return (
      <LobbyContainer>
        <div className="heading">
          <h1>{window.location.href}</h1>
          <span>Join by entering this link</span>
        </div>
        <ol>
          {this.props.users.map((user, index) => (
            <li key={user.socketid}>
              {index + 1} - {user.username}
            </li>
          ))}
        </ol>
        <Button onClick={this.props.startGame}>Start game</Button>
      </LobbyContainer>
    );
  }
}

export default Lobby;
