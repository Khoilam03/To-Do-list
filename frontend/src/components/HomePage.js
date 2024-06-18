import React, { Component } from "react";
import RoomJoinPage from "./GettingToDo";
import CreateRoomPage from "./CreateToDo";
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
            <h1>This is the homasdfe page</h1>
          </Route>
          <Route path="/join" component={GettingToDo} />
          <Route path="/create" component={CreateToDo} />
        </Switch>
      </Router>
    );
  }
}