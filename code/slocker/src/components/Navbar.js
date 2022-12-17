import React from 'react'
import '../css/home.css'
import locker from '../assets/locker.png';


export const Navbar = () => {
    return (
      <div className='navbox'>
        <div className='leftside'>
        <div className="lockerimage">
            <img src={locker} alt="locker" />
    </div>
        </div>
      </div>
    )
  }


export default Navbar