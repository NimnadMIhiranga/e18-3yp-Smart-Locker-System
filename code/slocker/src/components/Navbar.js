import React from 'react'
import { Link } from 'react-router-dom'
import '../css/home.css'


export const Navbar = () => {
    return (
      <div className='navbox'>
        <div className='leftside'>
        <h1>SLocker</h1>
        </div>
        <div className='rightside'>
            <Link to="signin" className='navlink'>SIGN IN</Link>
            <Link to="Signup" className='navlink1'><button className='navlink1'>SIGN UP</button></Link>
        </div>
      </div>
    )
  }


export default Navbar