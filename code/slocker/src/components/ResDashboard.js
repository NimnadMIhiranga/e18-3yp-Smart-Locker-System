import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model1 from "react-modal";
import Model2 from "react-modal";
import Model3 from "react-modal";
import Model from "react-modal";
import { db } from "../config/config";




export const ResDashboard = ({user, userID, uID}) =>{

    const history = useHistory();
    const {state} = useLocation();
    const [lockers, setLockers] = useState([]);
    const [visible, setvisible] = useState(false);
    const [visible1, setvisible1] = useState(false);
    const [visible2, setvisible2] = useState(false);
    const [visible3, setvisible3] = useState(false);
    const countref = useRef();
    const [error, setError] = useState("");
    const [lockID, setlockID] = useState("");
    const [State, setState] = useState("");
    const [bookingDate, setDate] = useState(new Date());
    const [bookingTime, setTime] = useState(new Date());
    const [lockPin, setPin] = useState("");

    
    const date = new Date();

    const showTime = date.getHours() 
        + ':' + date.getMinutes() 
        + ":" + date.getSeconds();
      
    const current = new Date();
    const today = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/');
            }
        });

        onValue(ref(realdb, 'Lockers/' + `/${state.ID}`), (snapshot)=>{
            setLockers([]);
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((locker) => {
                    setLockers((oldArray) => [...oldArray, locker]);
                });
            }
        });
    },[]);

    async function handleLogout() {
        setError("")
    
        try {
          await auth.signOut()
          history.push("/")
        } catch {
          setError("Failed to log out")
        }
      }


      const addLock = (locationID) =>{

        set(ref(realdb, 'Lockers/' + `/${locationID}` + `/${lockID}`),{
          lockID,
          State,
        });
          setvisible(false);
          setlockID("");
          setState("");
    }

      const lockidChange = (e) => {
        setlockID(e.target.value);
      };

      const stateChange = (e) => {
        setState(e.target.value);
      };


      const pinChange = (e) => {
        setPin(e.target.value);
      };


    const deleteLock = (locaID, locker) =>{
        try{
            remove(ref(realdb, 'Lockers/' + `/${locaID}` + `/${lockID}`));
            setvisible3(false);
        }catch{
            setError("Failed to delete");
            setvisible3(false);
        }
    }

    const editLock = (locaID) =>{
        try{
            update(ref(realdb, 'Lockers/' + `/${locaID}` + `/${lockID}`),{
                State,
            }
            );
            setvisible2(false);
        }catch{
            setError("Failed to delete");
            setvisible2(false);
        }
    }


    const bookLock = (locaID, uID, locaName) =>{
        try{
            update(ref(realdb, 'Lockers/' + `/${locaID}` + `/${lockID}`),{
                lockID,
                State: "unavilable",
                lockPin,
                today,
                showTime,
                uID,
            }
            );

            db.collection("User Data")
                .doc(uID)
                .collection("Bookings")
                .add({
                    lockID : lockID,
                    Date : today,
                    Booking_time : showTime, 
                    location : locaName,
                    status : "Available",
                })
            setvisible1(false);
        }catch{
            setError("Failed to book this locker");
            setvisible1(false);
        }
    }

    //<Resbox user={user} userID = {userID} locationID ={state.ID}/>
/*
    {userID && locker.State === "unavilable" && (
        <div>
        <button className="lock-edit" onClick={() => setvisible2(true)}>
        Edit State
    </button>
    <Model2 isOpen={visible2} onRequestClose={() => setvisible2(false)} className="model1box">
        <h1>Edit Locker Details</h1><br/>
        <form autoComplete="off">
        <label htmlFor="text" className="changepassword">
            Enter Locker ID
        </label><br />
        <input type="text" className="addlocker-form-control" required
            value={lockID} onChange={lockidChange} /><br /><br />
        <label htmlFor="number" className="changepassword">
            Enter current state
        </label><br />
        <input type="text" className="addlocker-form-control" required
            value={State} onChange={stateChange} />
        <button type="submit" className="edit-button" onClick={() => editLock(state.ID)}>Edit</button>
        </form><br />
        <button onClick={() => setvisible2(false)} className="edit-cancel-button">Cancel</button>
    </Model2>
    </div>
    )}


    <button className="lock-edit" onClick={() => setvisible2(true)}>
                                Edit State
                            </button>
                            <Model2 isOpen={visible2} onRequestClose={() => setvisible2(false)} className="model1box">
                                <h1>Edit Locker Details</h1><br/>
                                <form autoComplete="off">
                                <label htmlFor="text" className="changepassword">
                                    Enter Locker ID
                                </label><br />
                                <input type="text" className="addlocker-form-control" required
                                    value={lockID} onChange={lockidChange} /><br /><br />
                                <label htmlFor="number" className="changepassword">
                                    Enter current state
                                </label><br />
                                <input type="text" className="addlocker-form-control" required
                                    value={State} onChange={stateChange} />
                                <button type="submit" className="edit-button" onClick={() => editLock(state.ID)}>Edit</button>
                                </form><br />
                                <button onClick={() => setvisible2(false)} className="edit-cancel-button">Cancel</button>
                            </Model2>
*/

    return(
        <div className ="Resboard">
            <div className = "gradient__bg">
            <div className='userbox'>
            <div className='leftside'>
                <h1>{user}</h1>
            </div>
            {userID && <div className='rightside'>
            <button variant="link" onClick={() => setvisible(true)} className='logout'>
                    + Add locker
                </button>
                <Model isOpen={visible} onRequestClose={() => setvisible(false)} className="model1box">
                <h1>Add Locker</h1><br />
                <form autoComplete="off">
                    <label htmlFor="Location-name" className="addlocker-formtext">
                        Enter Locker ID
                    </label><br />
                    <input  type="number" className="addlocker-form-control" required
                    value={lockID} onChange={lockidChange}/> <br /><br />
                    <label htmlFor="locker-count" className="addlocker-formtext">
                    Enter State of Locker
                    </label><br />
                    <input type="text" className="addlocker-form-control" required
                    value={State} onChange={stateChange} /><br /> <br />
                    <button type="submit" className="lockeraddbutton" onClick={() => addLock(state.ID)}
                  > Add Locker</button>{error && <span className="error-msg">{error}</span>}
                </form>
                <button
                  onClick={() => setvisible(false)}
                  className="locker-cancelbutton">
                  Cancel
                </button>
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
            </button>
            </div>}

            </div>
                {lockers.length!==0 && <h1 className='lockhead'>Lockers at {state.Name}</h1> }
                {state.ID && lockers.map((locker) => (
                    <div className='card-lock'>
                        <div className='lockID'>
                            Locker {locker.lockID}
                        </div>
                        <div className='state'>
                            {locker.State}
                        </div>
                        {userID && locker.State === "available" && (
                            <div>
                            <button className="locker-book" onClick={() => setvisible1(true)}>
                                Book Lockers
                            </button>
                            <Model1 isOpen={visible1} onRequestClose={() => setvisible1(false)} className="model1box">
                                <h1>Book Locker</h1><br/>
                                <form autoComplete="off">
                                <label htmlFor="text" className="changepassword">
                                    Enter Locker ID
                                </label><br />
                                <input type="number" className="addlocker-form-control" required
                                    value={lockID} onChange={lockidChange} /><br /><br />
                                <label htmlFor="text" className="changepassword">
                                    Enter your unlock pin
                                </label><br />
                                <input type="number" className="addlocker-form-control" required
                                    value={lockPin} onChange={pinChange} /><br /><br />
                                    <br/><br/><button type="submit" className="edit-button" onClick={() => bookLock(state.ID, uID, state.Name)}>Book locker</button>
                                    <button onClick={() => setvisible1(false)} className="edit-cancel-button">Cancel</button>
                                </form>
                            </Model1>
                            
                            <button className="lock-delete" onClick={() => setvisible3(true)}>
                                Delete Locker
                            </button>
                            <Model3 isOpen={visible3} onRequestClose={() => setvisible3(false)} className="model1box">
                                <p className="para">Are you sure to delete this location?</p><br />
                                <form autoComplete="off">
                                <label htmlFor="number" className="changepassword">
                                    Enter Locker ID
                                </label><br />
                                <input type="text" className="addlocker-form-control" required
                                    value={lockID} onChange={lockidChange} />
                                <button type="submit" className="edit-button"  onClick={() => {deleteLock(state.ID);
                                //window.location.reload(false);
                                }}>
                                    Delete
                                </button>
                                </form>
                                <button onClick={() => setvisible3(false)} className="cancel-button">
                                    Cancel
                                </button>
                            </Model3>
                            </div>
                        )}
                        {!userID && locker.State === "available" && (
                             <div>
                             <button className="locker-book" onClick={() => setvisible1(true)}>
                                 Book Lockers
                             </button>
                             <Model1 isOpen={visible1} onRequestClose={() => setvisible1(false)} className="model1box">
                                 <h1>Book Locker</h1><br/>
                                 <form autoComplete="off">
                                 <label htmlFor="text" className="changepassword">
                                     Enter Locker ID
                                 </label><br />
                                 <input type="number" className="addlocker-form-control" required
                                     value={lockID} onChange={lockidChange} /><br /><br />
                                 <label htmlFor="text" className="changepassword">
                                     Enter your unlock pin
                                 </label><br />
                                 <input type="number" className="addlocker-form-control" required
                                     value={lockPin} onChange={pinChange} /><br /><br />
                                     <br/><br/><button type="submit" className="edit-button" onClick={() => bookLock(state.ID, uID, state.Name)}>Book locker</button>
                                     <button onClick={() => setvisible1(false)} className="edit-cancel-button">Cancel</button>
                                 </form>
                             </Model1>
                             </div>
                        )}
                    </div> 
                ))}
                </div>
            </div>
    )


}


export default ResDashboard