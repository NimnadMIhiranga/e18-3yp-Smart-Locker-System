import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../css/LockerDashboard.css";
import { auth } from "../config/config";
import { db } from "../config/config";
import Model from "react-modal";

export const Lockerbox = ({ user, userID }) => {
  const [error, setError] = useState("");
  const history = useHistory();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [visible, setvisible] = useState(false);

  async function handleLogout() {
    setError("");

    try {
      await auth.signOut();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  async function addlocation(e) {
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
  }

  return (
    <div className="userbox">
      <div className="leftside">
        <h1>{user} </h1>
      </div>
      {userID && (
        <div className="rightside">
          <button className="button5" onClick={() => setvisible(true)}>
            + Add a new location
          </button>
          <Model
            isOpen={visible}
            onRequestClose={() => setvisible(false)}
            className="locker-modelbox"
          >
            <h1>Add a new location</h1>
            <br />
            <form autoComplete="off" onSubmit={addlocation}>
              <label htmlFor="Location-name" className="addlocker-formtext">
                Location Name
              </label>
              <br />
              <input
                type="text"
                className="addlocker-form-control"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <br />
              <br />
              <label htmlFor="locker-count" className="addlocker-formtext">
                Number of lockers
              </label>
              <br />
              <input
                type="number"
                className="addlocker-form-control"
                required
                onChange={(e) => setCount(e.target.value)}
                value={count}
              />
              <br />
              <br />
              <button type="submit" className="lockeraddbutton">
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
          <button variant="link" onClick={handleLogout} className="logout">
            Log Out
          </button>{" "}
        </div>
      )}
      {!userID && (
        <div className="rightside">
          <button variant="link" onClick={handleLogout} className="logout">
            Log Out
          </button>{" "}
        </div>
      )}
    </div>
  );
};

export default Lockerbox;
