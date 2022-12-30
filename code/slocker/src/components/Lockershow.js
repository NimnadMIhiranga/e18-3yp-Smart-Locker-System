import React, { useContext, useState,useRef } from 'react'
import { LocationContext } from '../global/LocationContext'
import '../css/LockerDashboard.css'
import Model1 from 'react-modal'
import Model2 from 'react-modal'
import { db } from "../config/config";


export const Lockershow= ({ user, userID }) => {

  const { locations } = useContext(LocationContext);
  const [visible, setvisible] = useState(false);
  const [visible1, setvisible1] = useState(false);
  //const countref = useRef();
  const [count, setCount] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  async function editlocation(e) {
    e.preventDefault();
    try {
            db.collection("Locations").doc(key).set({
                Count: count,
              }) .then(() => {
                setKey("");
                setCount("");
              })
              .catch((err) => setError(err.message));
    } catch {
      setvisible1(false);
  setError("Failed to edit the count");
}
}


  return (
    <div>
    {locations.length !== 0 && <h1 className="show">Already Added Locations</h1>}
    {locations.length === 0 && <div className='error-msg'>slow internet...no locations to display</div>}
    {locations.map(location => (
        <div className='card' key={location.LocationID}>
          <div className='name'>
              Location  - {location.LocationName}
          </div>
          <div className='count'>
               Number of lockers -  {location.LocationCount}
          </div>
          <div>
          <button className='locker-go'>Go to lockers</button>

          <button className='locker-edit'onClick={()=>setvisible1(true)}>Edit count</button>
          <Model2 isOpen={visible1} onRequestClose={()=>setvisible1(false)}className='model1box'>
          <h1>Edit the locker count</h1><br/>
          <form autoComplete="off" onSubmit={editlocation(location.LocationID)}>
          <label htmlFor="passowrd" className="changepassword">
            Enter new count
          </label>
          <br />
          <input
            type="count"
            className="form-password"
            required
            onChange={(e) => setCount(e.target.value)}
            value={count}
          />
          <button type="submit" className="edit-button">Edit</button>
          </form><br/>
          <button onClick={()=>setvisible1(false)} className="edit-cancel-button">Cancel</button>
          </Model2>

          <button className='locker-delete' onClick={()=>setvisible(true)}>Delete location</button>
          <Model1 isOpen={visible} onRequestClose={()=>setvisible(false)}className='model1box'>
          <p className='para'>Are you sure to delete this location?</p><br/>
          <button type="submit" className="deletebutton">Delete</button>
          <button onClick={()=>setvisible(false)} className="cancel-button">Cancel</button>
          </Model1>

          </div>
        </div>
    ))}
    </div>

  )
}
