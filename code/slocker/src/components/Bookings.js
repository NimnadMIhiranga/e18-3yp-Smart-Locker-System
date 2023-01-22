import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import '../css/Booking.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";




export const Bookings = ({user, userID, UID}) => {

  const [error, setError] = useState("");
  const history = useHistory();
  const [bookings , setBookings] = useState([]);
  const [visible, setvisible] = useState(false);
  const {state} = useLocation();
  const [LockPin, setPin] = useState("");



  async function handleLogout() {
    setError("")
  
    try {
      await auth.signOut()
      history.push("/")
    } catch {
      setError("Failed to log out")
    }
  }

  const pinChange = (e) => {
    const limit = 4;
    setPin(e.target.value.slice(0,limit));
  };


  const BookID = new Date();

    const BookingTime = BookID.getHours() 
        + ':' + BookID.getMinutes() 
        + ":" + BookID.getSeconds();

    const month = BookID.getMonth() + 1;

    const BookingDate1 = BookID.getFullYear()+'-'+month+'-'+BookID.getDate();
      
    const BookingDate = `${BookID.getDate()}/${BookID.getMonth()+1}/${BookID.getFullYear()}`;

    const BookingID = BookingDate1+ ' ' +BookingTime;

  useEffect(() => {
    onValue(ref(realdb, 'Bookings/' + `/${UID}`), (snapshot)=>{
      setBookings([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((booking) => {
          setBookings((oldArray) => [...oldArray, booking]);
        });
      }
    });
  }, []);

  const LockID = state.LockID;
  const LocationName = state.Name;


  const bookLock = (UID, LocationName, LockID) =>{
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

          

            
    }catch{
        setError("Failed to book this locker");
    }
    

    
  }


  const cancelBooking = (BookingID, UID, locationName, lockID) =>{
    try{
      update(ref(realdb, 'Bookings/' + `/${UID}` + `/${BookingID}`),{
          State:'1',
      }
      );

      update(ref(realdb, 'Lockers/' + `/${locationName}` + `/${lockID}`),{
        BookingID : "",
        State: "1",
        LockPin: "",
        BookingDate: "",
        BookingTime: "",
        UID: "",
        LockState : "",
        In : "",
    }
    );

      setvisible(false);
  }catch{
      setError("Failed to delete");
      setvisible(false);
  }
  }

  

  return (
    <div className ="Resboard">
      <div className = "gradient__bg">
      <div className='userbox'>
      <div className='leftside'>
                <h1>{user}</h1>
      </div>
      <div className='rightside'>
        <Link to="UserDashboard" ><button variant="link" className='logout'>
              GoBack
        </button></Link>
        <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
            </button>
      </div>
      </div>
      <h1 className='locker-head'>Reservations</h1>
      
      {LockID!=="0" && <form autoComplete="off" className='form-book'>
      <label htmlFor="text" className="pin">
        Enter your pin
      </label>
      <input type="number"  min="1" className="addpin-form-control" required
        value={LockPin} onChange={pinChange} />
        <Link to={{pathname:"Bookings",state:{Name: "0", LockID: "0"}}} ><button type="submit" className="book-button" onClick={() => bookLock(UID, LocationName, LockID)}>Book locker</button></Link>
        </form>}
        {bookings.map((booking)=>((booking.State==='0') && 
       <button className="book-locker-yellow">
         <div className='lockid'>Locker {booking.LockID} - {booking.LocationName}</div>
         Booking Date : {booking.BookingDate}<br/>
           Booking Time : {booking.BookingTime}<br/>
        <br/>
        <button className='cancel-book' onClick={() => {cancelBooking(booking.BookingID, UID, booking.LocationName, booking.LockID)}}>Cancel Booking</button>
         </button>))}
      {bookings.map((booking)=>((booking.State==='1') && 
      <button className="book-locker-red">
        <div className='lockid'>Locker {booking.LockID} - {booking.LocationName}</div>
         Booking Date {booking.BookingDate}<br />
         Booking Time {booking.BookingTime}<br />
         </button>))}
      </div>
      </div>
    )
  }


