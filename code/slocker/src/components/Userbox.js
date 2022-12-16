import React from 'react'
import { Link } from 'react-router-dom'
import '../css/UserDashboard.css'

export const Userbox = () =>  {
    return (
        <div className='userbox'>
        <div className='leftside'>
        <h1>Hello User</h1> 
        </div>
        <div className='rightside'>
        <Link to="/" className='navlink'>LOG OUT</Link>
        </div>
    </div>
    )
  }


export default Userbox