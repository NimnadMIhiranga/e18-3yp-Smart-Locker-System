import React, { Component } from "react";
import "../css/home.css";
import { Navbar } from "./Navbar";
import { Header } from "./Header";

export class home extends Component {
  render() {
    return (
      <div className="wrapper">
        <div className="gradient__bg">
          <Navbar />
          <Header />
        </div>
      </div>
    );
  }
}

export default home;
