import React from 'react'
import '../css/home.css'
import locker from '../assets/locker.png';

export const Header = () =>  {
    return (
        <div className="locker__header section__padding" id="home">
            <div className="locker__header-content">
            <h1 className="gradient__text">Welcome To SLocker</h1>
            <p>SLocker is a smart locker sysytem which can ba put your bags 
      safely when you leave them. You just need to create a SLocker account
      using our web interface or our mobile application to get the benifit of this app.
      Currently our locker system is located in engineering faculty premises.</p>
            </div>
            <div className="lockerimage">
            <img src={locker} alt="locker" />
    </div>
        </div>
    )
  }


export default Header