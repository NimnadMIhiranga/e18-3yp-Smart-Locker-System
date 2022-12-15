import React from 'react'
import { Link } from 'react-router-dom'
import '../css/home.css'


export const Navbar = () => {
    return (
      <div className='navbox'>
        <div className='leftside'>
        </div>
          <h1>SLocker</h1>
        <div className='rightside'>
            <Link to="signin" className='navlink'>SIGN IN</Link>
            <Link to="signup" className='navlink'>SIGN UP</Link>
        </div>
      </div>
    )
  }


export default Navbar