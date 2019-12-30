import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Home from "./components/Home";
import Room from "./components/Room";

const theme = {
  black: "#101010",
  white: "#fff",
  grey: "#999",
  danger: "#ff4757"
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Muli:200,300,400&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  html {
    font-size: 62.5%;
    box-sizing: border-box;
    height: 100vh;
  }

  body {
    height: 100vh;
    font-family: "Muli", sans-serif;
    font-size: 1.6rem;
    font-weight: 300;
    color: ${({ theme }) => theme.white};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 300;
  }

  h1 {
    font-size: 6rem;
    text-align: center;
  }
`;

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route path="/:roomid" component={Room} />
          </Switch>
          <Switch>
            <Route path="/" component={Home} exact />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
