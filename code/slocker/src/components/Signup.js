import React from "react";
import "../css/Signup.css";
import { Link } from "react-router-dom";

export const Signup = () => {
  return (
    <div className="bgradient__bg">
      <div className="locker__header section__padding" id="signup">
        <div className="locker__header-content">
          <h1 className="gradient__text">Sign Up</h1>
          <br />
          <br />
          <form autoComplete="off" className="form-group" onSubmit={Signup}>
            <label htmlFor="name" className="name">
              Name
            </label>
            {/* <br /> */}
            <br />
            <input type="text" className="name" required />
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="email" className="formtext">
              Email
            </label>
            {/* <br /> */}
            <br />
            <input type="email" className="form-control" required />
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="passowrd" className="formtext">
              Password
            </label>
            {/* <br /> */}
            <br />
            <input type="password" className="form-control" required />
            <br />
            <br />
            <br />
            <Link to="UserDashboard">
              <button type="submit" className="submitbutton">
                Sign in
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
