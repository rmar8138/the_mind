import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/:roomid" component={Room} />
        </Switch>
        <Switch>
          <Route path="/" component={Home} exact />
        </Switch>
      </Router>
    );
  }
}

export default App;
