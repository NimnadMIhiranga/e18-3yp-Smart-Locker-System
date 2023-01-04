import React , { useState, useRef } from 'react'
import { useHistory} from 'react-router-dom'
import '../css/Res.css'
import { auth } from "../config/config"
import { db } from "../config/config";
import Model from 'react-modal'
import { Link } from 'react-router-dom'

export const Resbox =({ user, userID, locationID }) => {

    const [error, setError] = useState("")
    const history = useHistory()
    const [visible, setvisible] = useState(false);
    const [available, setAvailable] = useState("");
    const [ID, setID] = useState("");
    const lockIDRef = useRef();
    const stateRef = useRef();


    async function handleLogout() {
        setError("")
    
        try {
          await auth.signOut()
          history.push("/")
        } catch {
          setError("Failed to log out")
        }
      }


      async function addLock(lID) {
        try{
          db.collection("Locations").doc(locationID)
          .collection("Lockers").add({
              ID: lockIDRef.current.value,
              State: stateRef.current.value,
          }) .then(() => {
            setvisible(false);
          })
        }catch{
          setvisible(false);
          setError("Failed to Add Locker");
        }
      }
    


      return (
        <div className='userbox'>
            <div className='leftside'>
            <h1>{user}</h1>
            </div>
            {userID  && <div className='rightside'>
            <button className='button5' onClick={()=>setvisible(true)}>+ Add Locker</button>
            <Model isOpen={visible} onRequestClose={()=>setvisible(false)} className='locker-modelbox'>
            <h1>Add a new locker</h1><br/>
            <form autoComplete="off" onSubmit={addLock}>
            <label htmlFor="Location-name" className="addlocker-formtext">Locker ID</label>
            <br/>
                <input type="number" className='addlocker-form-control' required
                    ref={lockIDRef} />
                <br /><br/>
                <label htmlFor="locker-count" className="addlocker-formtext">Availability of the locker</label>
                <br/>
                <input type="text" className='addlocker-form-control' required
                    ref={stateRef} />
                <br /><br/>
                <button type="submit" className='lockeraddbutton'>Add Locker</button>
                {error && <span className='error-msg'>{error}</span>}
            </form>
            <button onClick={()=>setvisible(false)} className="locker-cancelbutton">Cancel</button>
            </Model>

            <Link to="LockerDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>

            <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
            </button>  
            </div>}


            {!userID && <div className='rightside'>
            <Link to="LockerDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>

            <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
        </button>  </div>}
        </div>
      )

    
}

export default Resbox