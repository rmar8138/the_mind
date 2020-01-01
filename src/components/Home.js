import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import shortid from "shortid";
import { Button } from "./styles/Button";
import { Container } from "./styles/Container";

const endpoint = "http://quiet-tor-63256.herokuapp.com";

const HomeContainer = styled(Container)`
  justify-content: space-between;

  .heading {
    text-align: center;
  }
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

    await axios.post(`${endpoint}/api/room`, { roomid });
    this.props.history.push(`/${roomid}`);
  };

  render() {
    return (
      <HomeContainer>
        <div className="heading">
          <h1>The Mind</h1>
          {this.state.error && <span>{this.state.error}</span>}
        </div>
        <Button onTap={this.createRoom}>Create new Room</Button>
      </HomeContainer>
    );
  }
}

export default Home;
