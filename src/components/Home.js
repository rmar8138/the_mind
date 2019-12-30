import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import shortid from "shortid";
import { Button } from "./styles/Button";
import { Container } from "./styles/Container";

const HomeContainer = styled(Container)`
  flex-direction: column;
  justify-content: space-between;
`;

export class Home extends Component {
  state = {
    error: null
  };

  async componentDidMount() {
    // set error message to render on initial redirect.
    // immediately clear history location state after sp
    // as to not render error on refresh
    if (this.props.location.state) {
      await this.setState(() => ({ error: this.props.location.state.error }));
      this.props.history.replace({
        pathname: "/",
        state: null
      });
    }
  }

  createRoom = async e => {
    const roomid = shortid.generate();

    e.preventDefault();

    await axios.post("http://localhost:5000/api/room", { roomid });
    this.props.history.push(`/${roomid}`);
  };

  render() {
    return (
      <HomeContainer>
        <h1>The Mind</h1>
        {this.state.error && <span>{this.state.error}</span>}
        <Button onClick={this.createRoom}>Create new Room</Button>
      </HomeContainer>
    );
  }
}

export default Home;
