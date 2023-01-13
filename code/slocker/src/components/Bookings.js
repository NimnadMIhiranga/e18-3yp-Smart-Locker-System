import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model from "react-modal";




export const Bookings = ({user, userID, uID}) => {

  const [error, setError] = useState("");
  const history = useHistory();
  const [bookings , setBookings] = useState([]);
  const [visible, setvisible] = useState(false);


  async function handleLogout() {
    setError("")
  
    try {
      await auth.signOut()
      history.push("/")
    } catch {
      setError("Failed to log out")
    }
  }

  useEffect(() => {
    onValue(ref(realdb, 'Bookings/' + `/${uID}`), (snapshot)=>{
      setBookings([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((booking) => {
          setBookings((oldArray) => [...oldArray, booking]);
        });
      }
    });
  }, []);


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
      <h1 className='lockhead'>My Bookings</h1>
      {bookings.map((book) => (
        <div className='card-lock'>
          <div className='lockID'>
            Locker {book.LockID}
          </div>
          <div className='lockID'>
            Locker Location - {book.LocationName}
          </div>
          <div className='lockID'>
            Booking Time - {book.BookingTime}
          </div>
          <div className='lockID'>
            Booking Date - {book.BookingDate}
          </div>
          {book.State !== "0" && (
            <div>
                <button className="lock-delete" onClick={() => setvisible(true)}>
                                Booking Closed
                </button>
            </div>
          )
          }
          {book.State === "0" && (
            <div>
                <button className="locker-book" onClick={() => setvisible(true)}>
                                Cancel this booking
                </button>
                <Model isOpen={visible} onRequestClose={() => setvisible(false)} className="model1box">
                  <p className="para">Do you want to cancel this booking?</p><br />
                  <button type="submit" className="edit-button" onClick={() => cancelBooking(book.BookingID, uID, book.LocationName, book.LockID)}>
                        Yes
                  </button>
                  <button onClick={() => setvisible(false)} className="cancel-button">
                        No
                  </button>
                </Model>
            </div>
          )
          }
        </div>
      ))}
      </div>
    </div>
  )
}


 /*
  useEffect(() => {
    getBookings(uID);
  }, []);

  const getBookings = (uID)=>{
    const booking = db.collection("User Data").doc(uID).collection("Bookings");
    booking.onSnapshot((querySnapShot)=>{
      const saveBookings = [];
      querySnapShot.forEach((doc)=>{
        saveBookings.push(doc.data());
      });
      setBookings(saveBookings);
    });
  };

  async function cancelBooking(bookID, UID) {
    try {
      db.collection("User Data")
        .doc(UID).
        collection("Bookings").doc(bookID)
        .update({
          state: "unAvilalble",
        });
      setvisible(false);
    } catch {
      setError("Failed to edit");
      setvisible(false);
    }
  }
  */
