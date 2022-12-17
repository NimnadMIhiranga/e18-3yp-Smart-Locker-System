import React, {useState} from "react";
import "../css/Signup.css";
import { Link } from "react-router-dom";


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

  return (
    <div className="bgradient__bg">
      <div className="locker__header section__padding" id="signup">
        <div className="locker__header-content">
          <h1 className="gradient__text">Sign Up</h1>
          <br />
          <br />
          <form autoComplete="off" className="form-group" onSubmit={Signup}>
            <label htmlFor="name" className="formtext">
              Name
            </label>
            {/* <br /> */}
            <br />
            <input type="text" className="form-control" required 
            onChange={(e)=>setName(e.target.value)} value={name}/>
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="email" className="formtext">
              Email
            </label>
            {/* <br /> */}
            <br />
            <input type="email" className="form-control" required 
            onChange={(e)=>setEmail(e.target.value)} value={name}/>
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="passowrd" className="formtext">
              Password
            </label>
            {/* <br /> */}
            <br />
            <input type="password" className="form-control" required 
            onChange={(e)=>setPassword(e.target.value)} value={name}/>
            <br />
            <br />
            <br />
            <Link to="UserDashboard">
              <button type="submit" className="submitbutton">
                Sign up
              </button>
            </Link>
          </form>
          {error && <div className='error-msg'></div>}
        </div>
      </div>
    </div>
  );
};

export default Signup;