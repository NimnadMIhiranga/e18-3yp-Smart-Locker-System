<<<<<<< HEAD
import React, {useState} from "react";
import "../css/Signup.css";
import { Link } from "react-router-dom";
import {auth, db} from '../config/config.js'

export const Signup = () => {

    const[name, setName]=useState('');
    const[email, setEmail]=useState('');
    const[password, setPassword]=useState('');
    const[error, setError]=useState('');

    const Signup = (e) =>{
        e.preventDefault();
        //console.log('form submitted');
        //console.log('name, email, password');
    }

=======
import React from "react";
import "../css/Signup.css";
import { Link } from "react-router-dom";

export const Signup = () => {
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
  return (
    <div className="bgradient__bg">
      <div className="locker__header section__padding" id="signup">
        <div className="locker__header-content">
          <h1 className="gradient__text">Sign Up</h1>
          <br />
          <br />
          <form autoComplete="off" className="form-group" onSubmit={Signup}>
<<<<<<< HEAD
            <label htmlFor="name" className="formtext">
=======
            <label htmlFor="name" className="name">
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
              Name
            </label>
            {/* <br /> */}
            <br />
<<<<<<< HEAD
            <input type="text" className="form-control" required 
            onChange={(e)=>setName(e.target.value)} value={name}/>
=======
            <input type="text" className="name" required />
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="email" className="formtext">
              Email
            </label>
            {/* <br /> */}
            <br />
<<<<<<< HEAD
            <input type="email" className="form-control" required 
            onChange={(e)=>setEmail(e.target.value)} value={name}/>
=======
            <input type="email" className="form-control" required />
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="passowrd" className="formtext">
              Password
            </label>
            {/* <br /> */}
            <br />
<<<<<<< HEAD
            <input type="password" className="form-control" required 
            onChange={(e)=>setPassword(e.target.value)} value={name}/>
=======
            <input type="password" className="form-control" required />
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
            <br />
            <br />
            <br />
            <Link to="UserDashboard">
              <button type="submit" className="submitbutton">
<<<<<<< HEAD
                Sign up
              </button>
            </Link>
          </form>
          {error && <div className='error-msg'></div>}
=======
                Sign in
              </button>
            </Link>
          </form>
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
        </div>
      </div>
    </div>
  );
};

export default Signup;
<<<<<<< HEAD

=======
>>>>>>> 8f1e4dc75bf96f7b015415f8f91d9bb8bbec377c
