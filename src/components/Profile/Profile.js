import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import {doc, getFirestore, setDoc, collection, where, query,getDoc} from 'firebase/firestore';
import {app} from '../../firebase';
import { TextField } from '@mui/material';
import {Button} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {useNavigate} from 'react-router-dom';

const db = getFirestore(app);

const Profile = ({authUser}) => {
 
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.email));

  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [location,setLocation] = useState('');
  const [dateAndTime, setDateAndTime] = useState(dayjs('2014-08-18T21:11:54'));
  // Note: here's an example of how to run a query
  const [snapshot, loading, error] = useCollection(
    query(
      collection(db, 'Events'),
      where('_coachId', '==', authUser.uid),
      
    )
  );
  const [snapshot2, loadings, errors] = useCollection(
    query(
      collection(db, 'Events'),
      
      
    )
  );
  const navigate = useNavigate();
  const navigateHome =()=>{
    navigate("/")
  }
 

  
  const handleFormData = (event) => {
    switch (event.target.id) {
      case 'activity-name':
        setActivityName(event.target.value);
        break;
      case 'description-of-event':
        setDescription(event.target.value);
        break;
      case 'loc':
        setLocation(event.target.value);
        break;
    }
  };
  const handleTimeAndDateData = (newDayJs) => {
    setDateAndTime(newDayJs);
  };
  const updateRoles= async()=>{
    let t1 = document.getElementById('role');
    let text = t1.value.toUpperCase();
  
    await setDoc(doc(db,"users",authUser.email),{role:text},{merge:true})
    .then(() => {
      console.log("Document successfully written!");
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
  }
  const joinEvent=async (id)=>{
    const docRef = doc(db, "Events", id);
    const docSnap = await getDoc(docRef);
    await setDoc(doc(db,"Volunteering",docSnap.data().__id),
    {
      eventid:docSnap.data().__id,
      userid: authUser.uid
    }).then(() => {
      console.log("Document successfully written!");
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
   
  }
  const saveFormData = async () => {
    const docRef = doc(collection(db, "Events"));
    await setDoc(docRef, {
      __id: docRef.id, 
      _coachId: authUser.uid,
      description:description,
      title: activityName,
      location: location,
      startTimeStamp: dateAndTime.toDate(),
      endTimeStamp: null,
    }).then(() => {
      console.log("Document successfully written!");
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
  };

    if (user) {
      if (user.data().role === 'COACH') {
        // return (<div>user is a COACH</div>);
        return (
            <div>
              
              <TextField
                id="activity-name"
                label="Name of Activity"
                value={activityName}
                variant="outlined"
                onChange={handleFormData}
              />
              <br></br>
              <TextField
                id="description-of-event"
                label="Description of event"
                value={description}
                variant="outlined"
                onChange={handleFormData}
              />
               <br></br>
              <TextField 
              id = "loc"
              label="Location"
              value= {location}
              variant="outlined"
              onChange={handleFormData}
              />
               <br></br>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="date-and-time"
                  label="Date and Time"
                  value={dateAndTime}
                  onChange={handleTimeAndDateData}
                  renderInput={(params) => <TextField {...params} />}
                />
                 <br></br>
              </LocalizationProvider>
              <div>Activity name: {activityName || '(empty)'}</div>
              <div>Description: {description || '(empty)'}</div>
            <div>Location: {location|| '(empty)'}</div>
              <div>Date and time: {dateAndTime.toDate().toString() || '(empty)'}</div>
              <button className="outline outline-1"onClick={saveFormData}>save form data</button>
             
              <br></br>
            
                {snapshot && (
                <span>
                  Collection:{' '}
                  {snapshot.docs.map((doc, i) => (
                    <div key={doc.id}>
                      <div>Event doc #{i+1}</div>
                      <div>Event Name: {doc.data().title}</div>
                      <div>Description: {doc.data().description}</div>
                      <div>Location: {doc.data().location}</div>
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
              
              <button className="outline outline-1"onClick = {navigateHome}>Go Home</button>
              <div>
            <label for="roles">Please select which role you are</label>
            <select className="outline outline-red-400 outline-1" name = "roles" id ="role">
             
              <option value="volunteer">Volunteer</option>
             <option value="coach">Coach</option>
               <option value="athlete">Athlete</option>
             </select>
             <br></br>
             <button className="outline outline-red rounded-md h-12 bg-red-500"onClick={updateRoles}>CHANGE ROLES</button>
             </div>
            </div>
        )
      } else if (user.data().role === 'VOLUNTEER'){
        return (

          <div className="relative h-1/2 w-1/2 ">
            <Button className="bg-red-400"variant="contained"onClick={navigateHome}>Test Go home</Button>
            <div className="text-4xl font-mono">Events coming up</div>
            {snapshot2 && (
                <span>
                  Collection:{' '}
                  {snapshot2.docs.map((doc, i) => (
                    <div key={doc.id}>
                      <div className="relative bg-red-200 w-1/2">
                        <div>Event Name: {doc.data().title}  Location: {doc.data().location}</div>
                     
                      <button className = "relative left-24 hover:text-blue-500" onClick={()=>joinEvent(doc.data().__id)}>Sign up for this event</button>
                      </div>
                     
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
            <div>
            <label for="roles">Please select which role you are</label>
            <select className="outline outline-red-400 outline-1" name = "roles" id ="role">
             
              <option value="volunteer">Volunteer</option>
             <option value="coach">Coach</option>
               <option value="athlete">Athlete</option>
             </select>
             <br></br>
             <button className=" rounded-md h-12 w-40 bg-red-500 text-white text-sm"onClick={updateRoles}>CHANGE ROLES</button>
            
             
             </div>
           
          </div>

        );
      }
    }

}

export default Profile
