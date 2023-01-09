import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { Resbox } from './Resbox';
import { auth } from '../config/config'
import { useHistory, useLocation } from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model1 from "react-modal";
import Model2 from "react-modal";
import Model3 from "react-modal";



export const ResDashboard = ({user, userID}) =>{

    const history = useHistory();
    const {state} = useLocation();
    const [lockers, setLockers] = useState([]);
    const [visible1, setvisible1] = useState(false);
    const [visible2, setvisible2] = useState(false);
    const [visible3, setvisible3] = useState(false);
    const countref = useRef();


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
    

    return(
        <div className ="Resboard">
            <div className = "gradient__bg">
                <Resbox user={user} userID = {userID}/>
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
                            </Model1>
                            <button className="lock-edit" onClick={() => setvisible2(true)}>
                                Edit State
                            </button>
                            <Model2 isOpen={visible2} onRequestClose={() => setvisible2(false)} className="model1box">
                                <h1>Edit Locker Details</h1><br/>
                                <form autoComplete="off">
                                <label htmlFor="text" className="changepassword">
                                    Enter current state
                                </label><br />
                                <input type="text" className="form-password" required ref={countref}/>
                                <button type="submit" className="edit-button">Edit</button>
                                </form><br />
                                <button onClick={() => setvisible2(false)} className="edit-cancel-button">Cancel</button>
                            </Model2>
                            <button className="lock-delete" onClick={() => setvisible3(true)}>
                                Delete Locker
                            </button>
                            <Model3 isOpen={visible3} onRequestClose={() => setvisible3(false)} className="model1box">
                                <p className="para">Are you sure to delete this location?</p><br />
                                <button type="submit" className="deletebutton">
                                    Delete
                                </button>
                                <button onClick={() => setvisible3(false)} className="cancel-button">
                                    Cancel
                                </button>
                            </Model3>
                            </div>
                        )}
                    </div> 
                ))}
                </div>
            </div>
    )


}


export default ResDashboard