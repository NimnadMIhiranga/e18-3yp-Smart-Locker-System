import React, { useState } from "react";
import "../css/Signup.css";
import "../css/home.css";
import { auth, db } from "../config/config";
import { Link } from "react-router-dom";

export const Signup = (props) => {
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        db.collection("User Data")
          .doc(cred.user.uid)
          .set({
            Name: userName,
            Email: email,
            uid: cred.user.uid,
          })
          .then(() => {
            setName("");
            setEmail("");
            setError("");
            props.history.push("/");
          })
          .catch((err) => setError(err.message));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="locker__header section__padding" id="home">
      <div className="locker__header-content">
        <h1 className="gradient__text">Welcome To SLocker</h1>
        <p>
          SLocker is a smart locker sysytem which can be put your bags safely
          when you leave them. You just need to create a SLocker account using
          our web interface or our mobile application to get the benifit of this
          app. Currently our locker system is located in engineering faculty
          premises.
        </p>
      </div>
      <div className="locker__header section__padding" id="signup">
        <div className="locker__header-content">
          <h1 className="gradient__text">Sign Up</h1>
          <br />
          <br />
          <form autoComplete="off" className="form-group" onSubmit={signup}>
            <label htmlFor="name" className="formtext">
              Name
            </label>
            {/* <br /> */}
            <br />
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setName(e.target.value)}
              value={userName}
            />
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="email" className="formtext">
              Email
            </label>
            {/* <br /> */}
            <br />
            <input
              type="email"
              className="form-control"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <br />
            {/* <br /> */}
            <label htmlFor="passowrd" className="formtext">
              Password
            </label>
            {/* <br /> */}
            <br />
            <input
              type="password"
              className="form-control"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <br />
            <br />
            <br />

            <button type="submit" className="submitbutton">
              Sign up
            </button>
          </form>
          {error && <span className="error-msg">{error}</span>}
          <br />
          <span className="signuphere">
            Already have an account? please Sign In
            <Link to="/" className="signuplink">
              {" "}
              Here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
