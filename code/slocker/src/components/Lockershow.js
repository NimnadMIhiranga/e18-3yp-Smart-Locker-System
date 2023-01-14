import React, { useContext, useState, useRef, useEffect } from "react";
import "../css/LockerDashboard.css";
import { Link } from "react-router-dom";
import { set, ref, onValue, remove, update } from "firebase/database";
import { realdb } from "../config/configreal";




export const Lockershow = ({ user, userID }) => {
  
  const [visible, setvisible] = useState(false);
  const [visible1, setvisible1] = useState(false);
  const [visible2, setvisible2] = useState(false);
  const [name, setName] = useState("");
  const countref = useRef();
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    onValue(ref(realdb, 'Lockers/'), (snapshot)=>{
      setLocations([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((location) => {
          setLocations((oldArray) => [...oldArray, location]);
      });
      }
    });
  },[]);

  return (
    <div>
      {locations.length !== 0 && <h1 className="show">Locations</h1>}
      {locations.length === 0 && (
        <div className="error-msg-location">
          slow internet...no locations to display
        </div>
      )}
      {locations.map((location) => (
        <div className="card" >
          <div className="name">Location - {location.Name}</div>
            <div>
              <Link to={{pathname:"ResDashboard",state:{
                  Name: location.Name
              }}}>
                <button className="locker-go">Show lockers</button>
              </Link>
            </div>
          
        </div>
      ))}
    </div>
  );
};



/*
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

  /*
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
  }*/

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
