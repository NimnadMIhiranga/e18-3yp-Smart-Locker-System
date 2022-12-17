import React from 'react'
import '../css/Signin.css'
import locker from '../assets/locker.png';


export const Signin= () => {
  return (
    <div className="locker__header section__padding" id="home">
      <div className="locker__header-content">
      <h1 className="gradient__text">Sign in</h1>
      <form autoComplete="off" className='form-group' onSubmit={Signin}>
      <label htmlFor="email">Email</label>
      <br/>
      </form>
      </div>
      <div className="lockerimage">
            <img src={locker} alt="locker" />
    </div>
    </div>
  )
}

export default Signin
