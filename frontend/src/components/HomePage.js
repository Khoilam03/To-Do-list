import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import CreateToDo from "./CreateToDo";
import GettingToDo from "./GettingToDo";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <h1>This is the home page</h1>
          </Route>
          <Route path="/get" component={GettingToDo} />
          <Route path="/create" component={CreateToDo} />
        </Switch>
      </Router>
    );
  }
}