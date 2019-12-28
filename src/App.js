import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Home from "./components/Home";
import Room from "./components/Room";

const theme = {
  black: "#333"
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  padding: 2rem, 4rem;
`;

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Container>
          <Router>
            <Switch>
              <Route path="/:roomid" component={Room} />
            </Switch>
            <Switch>
              <Route path="/" component={Home} exact />
            </Switch>
          </Router>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
