import React, { Component } from 'react'
import '../css/home.css'
import { Navbar } from './Navbar';

export class home extends Component {
  render() {
    return (
      <div className ="wrapper">
        <Navbar/>
      </div>
    )
  }
}

export default home