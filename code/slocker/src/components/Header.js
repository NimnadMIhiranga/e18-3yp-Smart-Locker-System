import React, { useRef, useState } from "react";
import "../css/home.css";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../config/config";

export const Header = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const history = useHistory();

  async function signin(e) {
    e.preventDefault();

    try {
      setError("");
      await auth.signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      );
      history.push("/UserDashboard");
    } catch {
      setError("Failed to log in");
    }
  }

  return (
    <div className="locker__header section__padding" id="home">
      <div className="locker__header-content">
        <h1 className="gradient__text">Welcome To SLocker</h1>
        <p>
          SLocker is a smart locker sysytem which can ba put your bags safely
          when you leave them. You just need to create a SLocker account using
          our web interface or our mobile application to get the benifit of this
          app. Currently our locker system is located in engineering faculty
          premises.
        </p>
      </div>
      <div className="container">
        <h1 className="signintext">Sign In</h1>
        <form autoComplete="off" className="form-group" onSubmit={signin}>
          <label htmlFor="email" className="formtext">
            Email
          </label>
          <br />
          <input
            type="email"
            className="form-control"
            required
            ref={emailRef}
          />

          <label htmlFor="passowrd" className="formtext">
            Password
          </label>
          <br />
          <input
            type="password"
            className="form-control"
            required
            ref={passwordRef}
          />
          <br />
          <button type="submit" className="submitbutton">
            Sign in
          </button>
        </form>
        {error && <span className="error-msg">{error}</span>}
        <br />
        <span className="signuphere">
          If you dont have an account? please signup
          <Link to="Signup" className="signuplink">
            {" "}
            Here
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Header;
