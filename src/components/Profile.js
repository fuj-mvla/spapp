import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore';
import {doc, getFirestore} from 'firebase/firestore';
import {app} from '../firebase';
const db = getFirestore(app);

const Profile = ({authUser}) => {
    const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.uid));
    console.log("profile");
  if (user.data().role=="COACH"){
    return (
        <div>
            <ul>
                <li>Event 1</li>
                <li>Event 1</li>
                <li>Event 1</li>
                <li>Event 1</li>
                <li>Event 1</li>
                
            </ul>
        <form action ="process.php" method="POST">
            <label>Name of Activity</label>
            <input type="text" name="activity"></input>
            <br></br>
            <label>Date and Time</label>
            <input type="date" name="date"></input>
            <br></br>
            <label>Description of event</label>
            <input type="date" name="date"></input>
            <br></br>
            <input type="submit" name="submit" value=""></input>
		<button>Click Me</button>
        </form>
        
        </div>
    )
  }
  else if (user.data().role=="VOLUNTEER"){
    <ul>
                <li>Event 1</li>
                <li>Event 1</li>
                <li>Event 1</li>
                <li>Event 1</li>
                <li>Event 1</li>
                
            </ul>
  }
}

export default Profile
