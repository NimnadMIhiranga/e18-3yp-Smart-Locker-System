import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "../css/LockerDashboard.css";
import { auth } from "../config/config";
import Model from "react-modal";
import Model1 from "react-modal";
import { realdb } from "../config/configreal";
import { set, ref, remove} from "firebase/database";

export const Lockerbox = ({ user, userID }) => {
  const [error, setError] = useState("");
  const history = useHistory();
  const [name, setName] = useState("");
  const [visible, setvisible] = useState(false);
  const [visible1, setvisible1] = useState(false);

  async function handleLogout() {
    setError("");

    try {
      await auth.signOut();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  const nameChange = (e) => {
    setName(e.target.value);
  };


  

  const addlocation =() =>{
    set(ref(realdb, 'Lockers/' + `/${name}`),{
      Name : name,
    });
    setvisible(false);
    setName("");
  }


  const deletelocation =() =>{
    try{
      remove(ref(realdb, 'Lockers/' + `/${name}`));
      setvisible1(false);
    }catch{
      setError("Failed to delete");
      setvisible1(false);
    }
  }


  return (
    <div className="userbox">
      <div className="leftside">
        <h1>{user} </h1>
      </div>
      {userID && (
        <div className="rightside">
          <button className="button5" onClick={() => setvisible(true)}>
            + Add location
          </button>
          <Model
            isOpen={visible}
            onRequestClose={() => setvisible(false)}
            className="locker-modelbox"
          >
            <h1>Add a new location</h1>
            <br />
            <form autoComplete="off">
              <label htmlFor="Location-name" className="addlocker-formtext">
                Location Name
              </label>
              <br />
              <input
                type="text"
                className="addlocker-form-control"
                required
                value={name} onChange={nameChange}
              />
              <br />
              <br />
              <button type="submit" className="lockeraddbutton" onClick={() => addlocation()}>
                Add Location
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
          <button className="button5" onClick={() => setvisible1(true)}>
            Deelete Location
          </button>
          <Model1  isOpen={visible1}
            onRequestClose={() => setvisible1(false)}
            className="locker-modelbox"
          >
            <h1>Delete location</h1>
            <br />
            <form autoComplete="off">
              <label htmlFor="Location-name" className="addlocker-formtext">
                Location Name
              </label>
              <br />
              <input
                type="text"
                className="addlocker-form-control"
                required
                value={name} onChange={nameChange}
              />
              <br />
              <br />
              <button type="submit" className="lockeraddbutton" onClick={() => deletelocation()}>
                Delete Location
              </button>
              {error && <span className="error-msg">{error}</span>}
              </form>
              <button
              onClick={() => setvisible1(false)}
              className="locker-cancelbutton"
            >
              Cancel
            </button>
          </Model1>
          
          <Link to="UserDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>
          <button variant="link" onClick={handleLogout} className="logout">
            Log Out
          </button>{" "}
        </div>
      )}
      {!userID && (
        <div className="rightside">
          <Link to="UserDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>
          <button variant="link" onClick={handleLogout} className="logout">
            Log Out
          </button>{" "}
        </div>
      )}
    </div>
  );
};

export default Lockerbox;



/*async function addlocation(e) {
    e.preventDefault();
    try {
      db.collection("Locations")
        .add({
          Name: name,
          Count: count,
          uid: userID,
        })
        .then(() => {
          setName("");
          setCount("");
          setError("");
          setvisible(false);
        })
        .catch((err) => setError(err.message));
    } catch {
      setvisible(false);
      setError("Failed to Add Location");
    }
  }*/
