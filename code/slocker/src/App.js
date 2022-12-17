<<<<<<< HEAD
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { home } from './components/home'
import { Signup } from './components/Signup'
import { UserDashboard } from './components/UserDashboard'


=======
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { home } from "./components/home";
import Signup from "./components/Signup";
import { UserDashboard } from "./components/UserDashboard";
import { Signin } from "./components/Signin";
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
<<<<<<< HEAD
      <Switch>
      <Route exact path='/' component={home} />
      <Route path='/signup' component={Signup} />
      <Route path='/UserDashboard' component={UserDashboard} />
      </Switch>
=======
        <Switch>
          <Route exact path="/" component={home} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
        </Switch>
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
      </BrowserRouter>
    );
  }
}

export default App;
