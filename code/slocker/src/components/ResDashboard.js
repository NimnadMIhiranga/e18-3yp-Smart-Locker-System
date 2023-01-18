import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model3 from "react-modal";
import Model from "react-modal";



export const ResDashboard = ({user, userID, UID}) =>{

    const history = useHistory();
    const {state} = useLocation();
    const [lockers, setLockers] = useState([]);
    const [locks, setLocks] = useState([]);
    const [visible, setvisible] = useState(false);
    const [visible3, setvisible3] = useState(false);
    const countref = useRef();
    const [error, setError] = useState("");
    const [Lockid, setlockID] = useState("");
    const [State, setState] = useState("");
    const [locations, setLocations] = useState([]);

    let countLocal = 0;

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

        countLocal ++;
        set(ref(realdb, 'Lockers/' + `/${locationName}` + `/${countLocal}`),{
          LockID : countLocal,
          State : "1",
        });
        update(ref(realdb, 'Lockers/' + `/${locationName}`),{
          Count : countLocal,
        });
          setvisible(false);
          setlockID("");
          setState("");
    }

    const deleteLock = (locaName) =>{
      remove(ref(realdb, 'Lockers/' + `/${locaName}` + `/${countLocal}`));
      countLocal--;
      update(ref(realdb, 'Lockers/' + `/${locaName}`),{
        Count : countLocal,
      });
    }


    return(
        <div className ="Resboard">
            <div className = "gradient__bg">
            <div className='userbox'>
            <div className='leftside'>
                <h1>{user}</h1>
            </div>
            {userID && <div className='rightside'>
         
            <button variant="link" onClick={() => addLock(state.Name)} className='logout'>
              Add Locker
                </button>

            <button variant="link" onClick={() => deleteLock(state.Name)} className='logout'>
              Delete Locker
                </button>
            
            <Link to="UserDashboard" ><button variant="link" className='logout'>
              Home
            </button></Link>
            <Link to="LockerDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>
            <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
            </button></div>}

            {!userID && <div className='rightside'>
            
            <Link to="UserDashboard" ><button variant="link" className='logout'>
              Home
            </button></Link>
            <Link to="LockerDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>
            <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
            </button></div>}
            
            </div>
            <div className='buttonSet'>
            {locations.map((location) => (
              countLocal = location.Count
            ))}
                </div>
                {lockers.length!==0 && <h1 className='locker-head'>Lockers at {state.Name}</h1> }
                {lockers.map((locker) => ((locker.State==='1') &&  <Link to={{pathname:"Bookings",state:{Name: state.Name, LockID: locker.LockID}}}>
                        <button className="locker-go">Locker {locker.LockID}</button>
                        </Link>
                    
                ))}
                </div>
                
            </div>
    )


}


export default ResDashboard;


// {/* <div>{(locker.State==='1')&& <div className='card-lock'>
//                     <div className='lockID'>
//                         Locker {locker.LockID}
//                     </div>
//                     {locker.State === "1" && (
//                         <div>
//                             <div>
//                             Available
//                             </div>
//                         <button className="locker-book" onClick={() => setvisible1(true)}>
//                             Book Locker
//                         </button>
//                         <Model1 isOpen={visible1} onRequestClose={() => setvisible1(false)} className="model1box">
//                             <h1>Book Locker</h1><br/>
//                             <form autoComplete="off">
//                             <label htmlFor="text" className="changepassword">
//                                 Enter Locker ID
//                             </label><br />
//                             <input type="number" className="addlocker-form-control" required
//                                 value={LockID} onChange={lockidChange} /><br /><br />
//                             <label htmlFor="text" className="changepassword">
//                                 Enter your unlock pin
//                             </label><br />
//                             <input type="number" className="addlocker-form-control" required
//                                 value={LockPin} onChange={pinChange} /><br /><br />
//                                 <br/><br/><button type="submit" className="edit-button" onClick={() => bookLock(UID, state.Name)}>Book locker</button>
//                                 <button onClick={() => setvisible1(false)} className="edit-cancel-button">Cancel</button>
//                             </form>
//                         </Model1>
                        
//                         </div>
//                     )}
//                 </div> }
//                     </div> */}


// const bookLock = (UID, LocationName) =>{
//   try{

//       update(ref(realdb, 'Lockers/' + `/${LocationName}` + `/${LockID}`),{
//           BookingID,
//           LockID,
//           State: "0",
//           LockPin,
//           BookingDate,
//           BookingTime,
//           UID,
//           LockState : "1",
//           In : "1",
//       }
//       );

//       set(ref(realdb, 'Bookings/' + `/${UID}` + `/${BookingID}`),{
//           BookingID,
//           LockID,
//           State : "0",
//           BookingTime,
//           BookingDate,
//           LocationName,

//         });
        
//           setvisible1(false);
//           setlockID("");
//           setState("");
          
//   }catch{
//       setError("Failed to book this locker");
//       setvisible1(false);
//   }
// }


// const BookID = new Date();

// const BookingTime = BookID.getHours() 
//     + ':' + BookID.getMinutes() 
//     + ":" + BookID.getSeconds();

// const month = BookID.getMonth() + 1;

// const BookingDate1 = BookID.getFullYear()+'-'+month+'-'+BookID.getDate();
  
// const BookingDate = `${BookID.getDate()}/${BookID.getMonth()+1}/${BookID.getFullYear()}`;

// const BookingID = BookingTime + ' ' +BookingDate1;

{/* <Model isOpen={visible} onRequestClose={() => setvisible(false)} className="model1box">
                <h1>Add Locker</h1><br />
                <form autoComplete="off">
                    <label htmlFor="Location-name" className="addlocker-formtext">
                        Enter Locker ID
                    </label><br />
                    <input  type="number" min="1" className="addlocker-form-control" required
                    value={LockID} onChange={lockidChange}/> <br /><br />
                    <button type="submit" className="lockeraddbutton" onClick={() => addLock(state.Name)}
                  > Add Locker</button>{error && <span className="error-msg">{error}</span>}
                </form>
                <button
                  onClick={() => setvisible(false)}
                  className="locker-cancelbutton">
                  Cancel
                </button>
                </Model> */}



              //   <button variant="link" onClick={() => setvisible3(true)} className='logout'>
              // Delete Locker
              //   </button>
              //   <Model3 isOpen={visible3} onRequestClose={() => setvisible3(false)} className="model1box">
              //       <p className="para">Are you sure to delete this locker?</p><br />
              //       <form autoComplete="off">
              //       <label htmlFor="number" className="changepassword">
              //                       Enter Locker ID
              //                   </label><br />
              //                   <input type="number" min="1" className="addlocker-form-control" required
              //                       value={Lockid} onChange={lockidChange} />
              //                   <button type="submit" className="edit-button"  onClick={() => {deleteLock(state.Name);
                                
              //                   }}>
              //                       Delete
              //                   </button>
              //                   </form>
              //                   <button onClick={() => setvisible3(false)} className="cancel-button">
              //                       Cancel
              //                   </button>
              //   </Model3>