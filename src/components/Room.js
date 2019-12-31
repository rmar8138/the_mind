import React, { Component } from "react";
import socketClient from "socket.io-client";
import axios from "axios";
import styled from "styled-components";
import Lobby from "./Lobby";
import Game from "./Game";
import { Container } from "./styles/Container";
import { Button } from "./styles/Button";

const endpoint = "http://localhost:5000";
let socket = null;

const UsernameForm = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  input {
    background-color: transparent;
    border: 1px solid white;
    padding: 1rem 2rem;
    border-radius: 10px;
    color: white;
    margin: 2rem 0;
    font-size: 2.6rem;
    font-weight: 200;
    text-align: center;
  }
`;

export class Room extends Component {
  state = {
    currentUser: "",
    gameStarted: false,
    loading: true,
    users: []
  };

  async componentDidMount() {
    const { roomid } = this.props.match.params;

    // query server for room to search for users
    const roomData = await axios.get(`${endpoint}/api/room?roomid=${roomid}`);

    // redirect if invalid room id
    if (!roomData.data) {
      // redirect with message
      return this.props.history.replace({
        pathname: "/",
        state: {
          error: "Room does not exist"
        }
      });
    }

    await this.setState(() => ({
      users: roomData.data.users,
      gameStarted: roomData.data.gameStarted,
      loading: false
    }));

    // redirect if game has already started
    if (this.state.gameStarted) {
      // redirect with message
      return this.props.history.replace({
        pathname: "/",
        state: {
          error: "Game has already started"
        }
      });
    }

    // redirect if game already has 4 players
    if (this.state.users.length >= 4) {
      // redirect with message
      return this.props.history.replace({
        pathname: "/",
        state: {
          error: "Room is full"
        }
      });
    }

    // establish socket connection
    socket = socketClient(endpoint, { roomid });
    socket.emit("setRoom", roomid);

    // socket logic
    socket.on("updateUsers", data => {
      this.setState(() => ({
        users: data
      }));
    });

    socket.on("startGame", () => {
      this.setState(() => ({ gameStarted: true }));
    });
  }

  joinRoom = e => {
    const { roomid } = this.props.match.params;
    const username = e.target.elements.username.value;

    e.preventDefault();

    this.setState(() => ({ currentUser: username }));

    socket.emit("joinRoom", { roomid, username, socketid: socket.id });
  };

  startGame = () => {
    // send socket event that renders game component for all connected sockets
    socket.emit("startGame");
  };

  render() {
    return this.state.loading ? (
      <h1>LOADING</h1>
    ) : this.state.currentUser ? (
      this.state.gameStarted ? (
        <Game
          currentUser={this.state.currentUser}
          users={this.state.users}
          socket={socket}
          history={this.props.history}
        />
      ) : (
        <Lobby
          roomid={this.props.match.params.roomid}
          users={this.state.users}
          startGame={this.startGame}
        />
      )
    ) : (
      <Container>
        <UsernameForm onSubmit={this.joinRoom}>
          <h1>Enter Username</h1>
          <input type="text" name="username" />
          <Button>Join Room</Button>
        </UsernameForm>
      </Container>
    );
  }
}

export default Room;
