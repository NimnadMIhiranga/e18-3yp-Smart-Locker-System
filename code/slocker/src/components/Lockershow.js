import React, { useContext, useState, useRef } from "react";
import { LocationContext } from "../global/LocationContext";
import "../css/LockerDashboard.css";
import Model1 from "react-modal";
import Model2 from "react-modal";
import { db } from "../config/config";
import { Link } from "react-router-dom";
import Model3 from "react-modal";
import Model4 from "react-modal";
import { set, ref, onValue, remove, update } from "firebase/database";
import { realdb } from "../config/configreal";



export const Lockershow = ({ user, userID }) => {
  const { locations } = useContext(LocationContext);
  const [visible, setvisible] = useState(false);
  const [visible1, setvisible1] = useState(false);
  const [visible2, setvisible2] = useState(false);
  const countref = useRef();
  //const lockIDRef = useRef();
  //const stateRef = useRef();
  //const countref = useRef();
  const [error, setError] = useState("");

  

  async function deletelocation(id) {
    try {
      db.collection("Locations")
        .doc(id)
        .delete();
      remove(ref(realdb, 'Lockers/' + `/${id}`));
      setvisible(false);
    } catch {
      setError("Failed to delete");
      setvisible(false);
    }
  }

  async function editlocation(location) {
    try {
      db.collection("Locations")
        .doc(location.LocationID)
        .update({
          Count: countref.current.value,
        });
      setvisible1(false);
    } catch {
      setError("Failed to edit");
      setvisible1(false);
    }
  }

  /*
  async function addLock(id) {
    try {
      db.collection("Locations")
        .doc(id)
        .collection("Lockers")
        .add({
          ID: lockIDRef.current.value,
          State: stateRef.current.value,
        })
        .then(() => {
          setvisible(false);
        });
    } catch {
      setvisible(false);
      setError("Failed to Add Locker");
    }
  }*/
  

  return (
    <div>
      {locations.length !== 0 && <h1 className="show">Locations</h1>}
      {locations.length === 0 && (
        <div className="error-msg-location">
          slow internet...no locations to display
        </div>
      )}
      {locations.map((location) => (
        <div className="card" key={location.LocationID}>
          <div className="name">Location - {location.LocationName}</div>
          <div className="count">
            Number of lockers - {location.LocationCount}
          </div>
           {userID && (
            <div>
             

              <Link to={{pathname:"ResDashboard",state:{
                  ID: location.LocationID, 
                  Name: location.LocationName
              }}}>
                <button className="locker-go">Show lockers</button>
              </Link>

              <button className="locker-edit" onClick={() => setvisible1(true)}>
                Edit count
              </button>
              <Model2
                isOpen={visible1}
                onRequestClose={() => setvisible1(false)}
                className="model1box"
              >
                <h1>Edit the locker count</h1>
                <br />
                <form autoComplete="off">
                  <label htmlFor="passowrd" className="changepassword">
                    Enter new count
                  </label>
                  <br />
                  <input
                    type="number"
                    className="form-password"
                    required
                    ref={countref}
                  />
                  <button
                    type="submit"
                    className="edit-button"
                    onClick={(event) => {
                      editlocation(location);
                      //window.location.reload(false);
                    }}
                  >
                    Edit
                  </button>
                </form>
                <br />
                <button
                  onClick={() => setvisible1(false)}
                  className="edit-cancel-button"
                >
                  Cancel
                </button>
              </Model2>

              <button
                className="locker-delete"
                onClick={() => setvisible(true)}
              >
                Delete location
              </button>
              <Model1
                isOpen={visible}
                onRequestClose={() => setvisible(false)}
                className="model1box"
              >
                <p className="para">Are you sure to delete this location?</p>
                <br />
                <button
                  type="submit"
                  className="deletebutton"
                  onClick={(event) => {
                    deletelocation(location.LocationID);
                    //window.location.reload(false);
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setvisible(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </Model1>
            </div>
          )}
          {!userID && (
            <div>
              <Link to={{pathname:"ResDashboard",state:{
                  ID: location.LocationID, 
                  Name: location.LocationName
              }}}>
                <button className="locker-go">Show lockers</button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
