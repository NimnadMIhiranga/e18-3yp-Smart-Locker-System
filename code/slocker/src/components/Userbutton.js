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
      <div className="image1">
            <img src={chat} alt="locker" className="image1"/>
            <img src={settings} alt="settings" className="image2"/>
            </div>
        <div className='topbuttons'>
            <Link to="Chat" ><button className='button1'>Chat with admin</button></Link>
            <Link to="Setting" ><button className='button2'>Go to setting</button></Link>
            
        </div>
        <div className="image2">
            <img src={lock} alt="locker" className="image3"/>
            <img src={history} alt="lock" className="image4"/>
            </div>
        <div className = 'bottombuttons'>
            <Link to="Booklocker" ><button className='button3'>Book a locker</button></Link>
            <Link to="Histroy" ><button className='button4'>Go to history</button></Link>
        </div>
    </div>
    </div>
  )
}
