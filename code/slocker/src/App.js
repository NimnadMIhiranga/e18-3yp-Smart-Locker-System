import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { home } from "./components/home";
import { Signup } from "./components/Signup";
import { UserDashboard } from "./components/UserDashboard";

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={home} />
          <Route path="/signup" component={Signup} />
          <Route path="/UserDashboard" component={UserDashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
