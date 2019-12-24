import React, { Component } from "react";

export class Room extends Component {
  state = {
    users: []
  };

  async componentDidMount() {
    // check if room exists
  }

  render() {
    return <div>{this.props.match.params.room}</div>;
  }
}

export default Room;
