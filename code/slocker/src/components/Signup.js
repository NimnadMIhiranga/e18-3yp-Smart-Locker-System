import React from 'react'
import '../css/Signup.css'
import profile from '../assets/profile.png';
import user from '../assets/user.png';

export const Signup = () => {
  return (
    <div className="main">
      <div className="sub-main">
      <div>
      <div className="imgs">
      <div className="container-image">
      <img src={profile} alt="profile" className="profile"/>
      </div>
      </div>
      <div className = "signup">
           <h1><br></br>Sign Up Page</h1></div>
           <br></br><br></br>
           <div>
             <img src={user} alt="username" className="username"/>
             <input type="text" placeholder="user name" className="name"/>
           </div>
      </div>
      </div>
    </div>
  )
}
