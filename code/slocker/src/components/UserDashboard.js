import React, { Component } from 'react'
import '../css/UserDashboard.css'
import { Userbox } from './Userbox';
import { Userbutton } from './Userbutton';

export class UserDashboard extends Component {
    render() {
    return (
        <div className ="dashboard">
            <div className = "gradient__bg">
            <Userbox/>
            <Userbutton/>
            </div>
        </div>
    )
    }
}

export default UserDashboard
