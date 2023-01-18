import React from 'react'
import { Link } from 'react-router-dom'
import lock from '../assets/lock.png';
import chat from '../assets/chat.png';
import history from '../assets/history.png';
import settings from '../assets/settings.png';


export const Userbutton= () => {
  return (
    <div className="button_region section__padding" id="UserDashboard">
      
    <div className='buttons'>
            </div>
  
            <Link to="Chat" ><button className='button'>
            <img src={chat} alt="locker" className='image'/>
            <div className='text-button'>Chat with admin</div></button></Link>
            <Link to="LockerDashboard" ><button className='button'><img src={lock} alt="locker" className='image'/><div className='text-button'>Locker Room</div></button></Link>
            <Link to="Setting" ><button className='button'>
            <img src={settings} alt="settings" className='image2'/><div className='text-button'>Go to setting</div></button></Link>
            <Link to={{pathname:"Bookings",state:{Name: "0", LockID: "0"}}} ><button className='button' ><img src={history} alt="lock" className='image2'/><div className='text-button'>Reservations</div></button></Link>
  
    </div>
  )
}
