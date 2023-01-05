import React , { useEffect , useState}from 'react';
import { auth, db } from "../config/config";
import { useHistory } from "react-router-dom";
import admin from '../assets/addadmin.png';
import chat from '../assets/chat.png';
import history from '../assets/history.png';
import settings from '../assets/settings.png';
import { Link } from 'react-router-dom'
import Model from 'react-modal'


export const Setting = ({ user, userID }) => {
    const history = useHistory();
    const [error, setError] = useState("");
    const [visible, setvisible] = useState(false);
    const [userName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 
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
                Admin:"1",
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
      <Link to="UserDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>
          <button variant="link" onClick={handleLogout} className="logout">
            Log Out
          </button>{" "}
        </div>
    </div>
    
    {userID && (
    <div className="button_region section__padding" id="UserDashboard">
      <div className='buttons'>
      <div className="image1">
            <img src={admin} alt="locker" className="image1"/>
            <img src={settings} alt="settings" className="image2"/>
            </div>
            <div className='topbuttons'>
            <button className='button1' onClick={() => setvisible(true)}>Add a new admin</button>
            
            <Model isOpen={visible} onRequestClose={() => setvisible(false)} className="model1box">
            <h1>Add an new admin</h1><br />
            <form autoComplete="off" onSubmit={signup}>
            <label htmlFor="Location-name" className="addlocker-formtext">
                    Enter Name</label><br />
            <input type="text" className="addlocker-form-control" required onChange={(e) => setName(e.target.value)}
              value={userName}/><br /><br />
            <label htmlFor="Location-name" className="addlocker-formtext">
                    Enter Email</label><br />
            <input type="email" className="addlocker-form-control" required onChange={(e) => setEmail(e.target.value)}
              value={email}/><br /><br />
            <label htmlFor="Location-name" className="addlocker-formtext">
                    Enter Password</label><br />
            <input type="password" className="addlocker-form-control" required onChange={(e) => setPassword(e.target.value)}
              value={password}/><br /><br />
            <button type="submit" className="lockeraddbutton">
              Add
            </button>
            {error && <span className="error-msg">{error}</span>}
            </form>
            <button onClick={() => setvisible(false)} className="locker-cancelbutton">
                  Cancel
            </button>
            </Model>

            <button className='button2'>Remove an user</button>
        </div>
        </div>  
    </div>)}
    </div>
  )
}
