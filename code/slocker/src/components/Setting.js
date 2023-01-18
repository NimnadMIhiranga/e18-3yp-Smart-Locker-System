import React, { useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { useHistory } from "react-router-dom";
import admin from "../assets/addadmin.png";
import logout from "../assets/Logout.png";
import passlogo from "../assets/Passlogo.png";
import { Link } from "react-router-dom";
import Model from "react-modal";
import '../css/Setting.css'
import {sendPasswordResetEmail} from 'firebase/auth';
import { authPassword } from "../config/configPassword";


export const Setting = ({ user, userID }) => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [visible, setvisible] = useState(false);
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible1, setvisible1] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push("/");
      }
    });
  });

  async function handleLogout() {
    setError("");

    try {
      await auth.signOut();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  const forgotPassword = () => {
    return sendPasswordResetEmail(authPassword, email);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

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
            Admin: "1",
          })
          .then(() => {
            setName("");
            setEmail("");
            setError("");
            setvisible(false);
          })
          .catch((err) => setError(err.message));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div>
      <div className="userbox">
        <div className="leftside">
          <h1>{user} </h1>
        </div>
        <div className="rightside">
          <Link to="UserDashboard">
            <button variant="link" className="logout">
              GoBack
            </button>
          </Link>
        </div>
      </div>

      {userID && (
        <div className="button_region section__padding" id="UserDashboard">
            <div >
            <button className='button-settings' onClick={() => setvisible(true)}>
            <img src={admin} alt="locker" className='image'/>
            <div className='text-button'>Add a new Admin</div></button>
              <Model
                isOpen={visible}
                onRequestClose={() => setvisible(false)}
                className="model1box"
              >
                <h1>Add a New Admin</h1>
                <br />
                <form autoComplete="off" onSubmit={signup}>
                  <label htmlFor="Location-name" className="addlocker-formtext">
                    Enter Name
                  </label>
                  <br />
                  <input
                    type="text"
                    className="addlocker-form-control"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={userName}
                  />
                  <br />
                  <br />
                  <label htmlFor="Location-name" className="addlocker-formtext">
                    Enter Email
                  </label>
                  <br />
                  <input
                    type="email"
                    className="addlocker-form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <br />
                  <br />
                  <label htmlFor="Location-name" className="addlocker-formtext">
                    Enter Password
                  </label>
                  <br />
                  <input
                    type="password"
                    className="addlocker-form-control"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <br />
                  <br />
                  <button type="submit" className="lockeraddbutton">
                    Add
                  </button>
                  {error && <span className="error-msg">{error}</span>}
                </form>
                <button
                  onClick={() => setvisible(false)}
                  className="locker-cancelbutton"
                >
                  Cancel
                </button>
              </Model>
              <button className='button-settings' onClick={handleLogout}>
            <img src={logout} alt="locker" className='image1'/>
            <div className='text-button'>Log Out</div></button>
            <button className='button-settings' onClick={() => setvisible1(true)}>
            <img src={passlogo} alt="locker" className='image1'/>
            <div className='text-button'>Change Password</div></button>
            <Model
          isOpen={visible1}
          onRequestClose={() => setvisible1(false)}
          className="modelbox"
        >
          <h1>Change your password</h1>
          <br />
          <form autoComplete="off" >
            <label htmlFor="passowrd" className="changepassword">
              Enter your email
            </label>
            <br />
            <input
              type="email"
              className="form-password"
              required
              value={email} onChange={emailChange}
            />
            <button type="submit" className="changebutton" onClick={() => {forgotPassword();}}>
              Change
            </button>
          </form>
          <br />
          <button onClick={() => setvisible1(false)} className="cancelbutton">
            Cancel
          </button>
        </Model>
            </div>
        </div>
      )}
      {!userID && (
        <div className="button_region section__padding" id="UserDashboard">
            <div >
            <button className='button-settings' onClick={handleLogout}>
            <img src={logout} alt="locker" className='image1'/>
            <div className='text-button'>Log Out</div></button>
            <button className='button-settings' onClick={() => setvisible1(true)}>
            <img src={passlogo} alt="locker" className='image1'/>
            <div className='text-button'>Change Password</div></button>
            <Model
          isOpen={visible1}
          onRequestClose={() => setvisible1(false)}
          className="modelbox"
        >
          <h1>Change your password</h1>
          <br />
          <form autoComplete="off" >
            <label htmlFor="passowrd" className="changepassword">
              Enter your email
            </label>
            <br />
            <input
              type="email"
              className="form-password"
              required
              value={email} onChange={emailChange}
            />
            <button type="submit" className="changebutton" onClick={() => {forgotPassword();}}>
              Change
            </button>
          </form>
          <br />
          <button onClick={() => setvisible1(false)} className="cancelbutton">
            Cancel
          </button>
        </Model>
            </div>
        </div>
      )}
    </div>
  );
};


