import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model1 from "react-modal";
import Model3 from "react-modal";
import Model from "react-modal";



export const ResDashboard = ({user, userID, UID}) =>{

    const history = useHistory();
    const {state} = useLocation();
    const [lockers, setLockers] = useState([]);
    const [count, setCount] = useState([]);
    const [visible, setvisible] = useState(false);
    const [visible1, setvisible1] = useState(false);
    const [visible2, setvisible2] = useState(false);
    const [visible3, setvisible3] = useState(false);
    const countref = useRef();
    const [error, setError] = useState("");
    const [LockID, setlockID] = useState("");
    const [State, setState] = useState("");
    const [LockPin, setPin] = useState("");

    
    const BookID = new Date();

    const BookingTime = BookID.getHours() 
        + ':' + BookID.getMinutes() 
        + ":" + BookID.getSeconds();

    const month = BookID.getMonth() + 1;

    const BookingDate1 = BookID.getDate()+':'+month+':'+BookID.getFullYear();
      
    const BookingDate = `${BookID.getDate()}/${BookID.getMonth()+1}/${BookID.getFullYear()}`;

    const BookingID = BookingTime + ' ' +BookingDate1;

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/');
            }
        });

        onValue(ref(realdb, 'Lockers/' + `/${state.Name}`), (snapshot)=>{
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


      const addLock = (locationName) =>{

        set(ref(realdb, 'Lockers/' + `/${locationName}` + `/${LockID}`),{
          LockID,
          State : "1",
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


    const deleteLock = (locaName) =>{
        try{
            remove(ref(realdb, 'Lockers/' + `/${locaName}` + `/${LockID}`));
            setvisible3(false);
        }catch{
            setError("Failed to delete");
            setvisible3(false);
        }
    }


    const bookLock = (UID, LocationName) =>{
        try{

            update(ref(realdb, 'Lockers/' + `/${LocationName}` + `/${LockID}`),{
                BookingID,
                LockID,
                State: "0",
                LockPin,
                BookingDate,
                BookingTime,
                UID,
                LockState : "1",
                In : "1",
            }
            );

            set(ref(realdb, 'Bookings/' + `/${UID}` + `/${BookingID}`),{
                BookingID,
                LockID,
                State : "0",
                BookingTime,
                BookingDate,
                LocationName,

              });
              
                setvisible1(false);
                setlockID("");
                setState("");
                
        }catch{
            setError("Failed to book this locker");
            setvisible1(false);
        }
    }



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
                    value={LockID} onChange={lockidChange}/> <br /><br />
                    <button type="submit" className="lockeraddbutton" onClick={() => addLock(state.Name)}
                  > Add Locker</button>{error && <span className="error-msg">{error}</span>}
                </form>
                <button
                  onClick={() => setvisible(false)}
                  className="locker-cancelbutton">
                  Cancel
                </button>
                </Model>
                <button variant="link" onClick={() => setvisible3(true)} className='logout'>
                    Delete locker
                </button>
                <Model3 isOpen={visible3} onRequestClose={() => setvisible3(false)} className="model1box">
                    <p className="para">Are you sure to delete this locker?</p><br />
                    <form autoComplete="off">
                    <label htmlFor="number" className="changepassword">
                                    Enter Locker ID
                                </label><br />
                                <input type="number" className="addlocker-form-control" required
                                    value={LockID} onChange={lockidChange} />
                                <button type="submit" className="edit-button"  onClick={() => {deleteLock(state.Name);
                                
                                }}>
                                    Delete
                                </button>
                                </form>
                                <button onClick={() => setvisible3(false)} className="cancel-button">
                                    Cancel
                                </button>
                </Model3>
            
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
                {lockers.map((locker) => (
                    <div>{(locker.State==='1' || locker.State==='0')&& <div className='card-lock'>
                    <div className='lockID'>
                        Locker {locker.LockID}
                    </div>
                    {locker.State === "1" && (
                        <div>
                            <div>
                            Available
                            </div>
                        <button className="locker-book" onClick={() => setvisible1(true)}>
                            Book Locker
                        </button>
                        <Model1 isOpen={visible1} onRequestClose={() => setvisible1(false)} className="model1box">
                            <h1>Book Locker</h1><br/>
                            <form autoComplete="off">
                            <label htmlFor="text" className="changepassword">
                                Enter Locker ID
                            </label><br />
                            <input type="number" className="addlocker-form-control" required
                                value={LockID} onChange={lockidChange} /><br /><br />
                            <label htmlFor="text" className="changepassword">
                                Enter your unlock pin
                            </label><br />
                            <input type="number" className="addlocker-form-control" required
                                value={LockPin} onChange={pinChange} /><br /><br />
                                <br/><br/><button type="submit" className="edit-button" onClick={() => bookLock(UID, state.Name)}>Book locker</button>
                                <button onClick={() => setvisible1(false)} className="edit-cancel-button">Cancel</button>
                            </form>
                        </Model1>
                        
                        </div>
                    )}
                    {locker.State === "0" && (
                        <div>
                        Unavailable
                        </div>
                    )}
                </div> }
                    </div>
                ))}
                </div>
                
            </div>
    )


}


export default ResDashboard;


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

 /*const editLock = (locaID) =>{
        try{
            update(ref(realdb, 'Lockers/' + `/${locaID}` + `/${LockID}`),{
                State,
            }
            );
            setvisible2(false);
        }catch{
            setError("Failed to delete");
            setvisible2(false);
        }
    }*/