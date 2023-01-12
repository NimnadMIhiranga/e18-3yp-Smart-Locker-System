import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model from "react-modal";
import { db } from "../config/config";



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
            Locker {book.id}
          </div>
          <div className='lockID'>
            Locker Location - {book.location}
          </div>
          <div className='lockID'>
            Booking Time - {book.Booking_time}
          </div>
          <div className='lockID'>
            Booking Date - {book.Date}
          </div>
          {book.state !== "Available" && (
            <div>
                <button className="lock-delete" onClick={() => setvisible(true)}>
                                Booking Closed
                </button>
            </div>
          )
          }
          {book.state === "Available" && (
            <div>
                <button className="locker-book" onClick={() => setvisible(true)}>
                                Cancel this booking
                </button>
                <Model isOpen={visible} onRequestClose={() => setvisible(false)} className="model1box">
                  <p className="para">Do you want to cancel this booking?</p><br />
                  <button type="submit" className="edit-button" onClick={() => cancelBooking(book.id, uID)}>
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
