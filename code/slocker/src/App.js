import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { home } from "./components/home";
import { Signup } from "./components/Signup";
import { UserDashboard } from "./components/UserDashboard";
import { LockerDashboard } from "./components/LockerDashboard";
import { ResDashboard } from "./components/ResDashboard";
import { AddLocation } from "./components/AddLocation";
import {auth, db} from "./config/config"
import { LocationContextProvider } from './global/LocationContext'
import { Setting } from "./components/Setting";
import { Bookings } from "./components/Bookings";


export class App extends Component {

  state={
    user: null,
    userID: null,
    uID: null
  }

  componentDidMount(){
    auth.onAuthStateChanged(user=>{
      if(user){
        db.collection('User Data').doc(user.uid).get().then(snapshot => {
          this.setState({
            user: snapshot.data().Name,
            userID : snapshot.data().Admin,
            uID : snapshot.data().uid
        })
        })
      }else {
        this.setState({
            user: null,
            userID : null,
            uID : null
        })
    }
    })
  }

  render() {
    return (
      <LocationContextProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={home} />
          <Route path="/signup" component={Signup} />
          <Route path="/UserDashboard" component={() => <UserDashboard user={this.state.user}/>} />
          <Route path="/LockerDashboard" component={() =><LockerDashboard user={this.state.user} userID = {this.state.userID}/>} />
          <Route path="/AddLocation" component={() =><AddLocation userID={this.state.userID}/>} />
          <Route path="/ResDashboard" component={() =><ResDashboard user={this.state.user} userID = {this.state.userID} UID = {this.state.uID}/>} />
          <Route path="/Bookings" component={() =><Bookings user={this.state.user} userID = {this.state.userID} uID = {this.state.uID}/>} />
          <Route path="/Setting" component={() =><Setting user={this.state.user} userID = {this.state.userID}/>} />
        </Switch>
      </BrowserRouter>
      </LocationContextProvider>
    );
  }
}

export default App;
