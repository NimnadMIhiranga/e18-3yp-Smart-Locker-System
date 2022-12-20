import React, { useEffect } from 'react'
import '../css/UserDashboard.css'
import { Userbox } from './Userbox';
import { Userbutton } from './Userbutton';
import { useHistory } from 'react-router-dom'
import { auth } from '../config/config'

export const UserDashboard = ({ user }) => {
    const history = useHistory();

    useEffect(() => {
        // forcing user to signup
        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/');
            }
        })
    })

    return (
        <div className ="dashboard">
            <div className = "gradient__bg">
            <Userbox user={user}/>
            <Userbutton/>
            </div>
        </div>
    )   
}

export default UserDashboard
