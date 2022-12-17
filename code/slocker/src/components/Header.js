import React from 'react'
import '../css/home.css'
import { Link } from 'react-router-dom'



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
            <div className="container">
                <h1 className="signintext">Sign In</h1>
                <br/>
                <form autoComplete="off" className='form-group' onSubmit={Header}>
                <label htmlFor="email" className='formtext'>Email</label>
                <br /><br />
                <input type="email" className='form-control' required/>
                <br /><br /><br />
                <label htmlFor="passowrd" className='formtext'>Password</label>
                <br /><br />
                <input type="password" className='form-control' required/>
                <br /><br /><br />
                <Link to="UserDashboard" ><button type="submit" className='submitbutton'>Sign in</button></Link>
                </form>
                <br/><br/>
                <span className='signuphere'>If you dont have an account? please signup
                <Link to="Signup" className='signuplink'> Here</Link>
            </span>

            </div>
            
        </div>
    )
  }


export default Header