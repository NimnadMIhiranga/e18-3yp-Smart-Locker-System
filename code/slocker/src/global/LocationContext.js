import React, { createContext, Component} from 'react'
import { db } from '../config/config'

export const LocationContext = createContext();

export class LocationContextProvider extends Component {

    state = {
        locations: []
    }

    /*onValue(ref(realdb, 'Lockers/' + `/${ID}`), (snapshot)=>{
            setLockers([]);
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((locker) => {
                    setLockers((oldArray) => [...oldArray, locker]);
                });
            }
        }); */

    componentDidMount() {

        const prevLocations = this.state.locations;
        db.collection('Locations').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    prevLocations.push({
                        LocationID: change.doc.id,
                        LocationName: change.doc.data().Name,
                        LocationCount: change.doc.data().Count
                    })
                }
                this.setState({
                    locations: prevLocations
                })
            })
        })
    }
    render() {
        return (
            <LocationContext.Provider value={{ locations: [...this.state.locations] }}>
                {this.props.children}
            </LocationContext.Provider>
        )
    }

}