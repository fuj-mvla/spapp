import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import {doc, getFirestore, setDoc, collection, where, query,deleteDoc} from 'firebase/firestore';
import {app} from '../../firebase';
import { TextField } from '@mui/material';
import {Button} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {useNavigate} from 'react-router-dom';

const db = getFirestore(app);

const Profile = ({authUser}) => {
  const navigate = useNavigate();
  const navigateHome =()=>{
    navigate("/")
  }
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.uid));

  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [des,setDesc] = useState('');
  const [dateAndTime, setDateAndTime] = useState(dayjs('2014-08-18T21:11:54'));
  // Note: here's an example of how to run a query
  const [snapshot, loading, error] = useCollection(
    query(
      collection(db, 'Events'),
      where('_coachId', '==', authUser.uid),
    )
  );
  const deleteData = async () =>{
    

    await deleteDoc(doc(db, "Events", "tksBfF04pFHQEBHPj1gc"));

  }
  const updateRoles= ()=>{
    let t1 = document.getElementById('role');
    console.log(t1.value);
  }

  const handleFormData = (event) => {
    switch (event.target.id) {
      case 'activity-name':
        setActivityName(event.target.value);
        break;
      case 'description-of-event':
        setDescription(event.target.value);
        break;
      case 'test':
        setDesc(event.target.value);
        break;
    }
  };
  const handleTimeAndDateData = (newDayJs) => {
    setDateAndTime(newDayJs);
  };

  const saveFormData = async () => {
    const docRef = doc(collection(db, "Events"));
    await setDoc(docRef, {
      __id: docRef.id, 
      _coachId: authUser.uid,
      description:description,
      title: activityName,
      startTimeStamp: null,
      endTimeStamp: dateAndTime.toDate(),
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
                variant="filled"
                onChange={handleFormData}
              />
              <TextField
                id="description-of-event"
                label="Description of event"
                value={description}
                variant="outlined"
                onChange={handleFormData}
              />
              <TextField 
              id = "test"
              label="I like Men"
              value= {des}
              variant="outlined"
              onChange={handleFormData}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  id="date-and-time"
                  label="Date and Time"
                  value={dateAndTime}
                  onChange={handleTimeAndDateData}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div>Activity name: {activityName || '(empty)'}</div>
              <div>Description: {description || '(empty)'}</div>
              <div>Test: {des|| "love men"}</div>
              <div>Date and time: {dateAndTime.toDate().toString() || '(empty)'}</div>
              <button onClick={saveFormData}>save form data</button>
              <button onClick = {deleteData}>test delete</button>
              <br></br>
            
                {snapshot && (
                <span>
                  Collection:{' '}
                  {snapshot.docs.map((doc, i) => (
                    <div key={doc.id}>
                      <div>Event doc #{i+1}</div>
                      <div>Title: {doc.data().title}</div>
                      <div>Description: {doc.data().description}</div>
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
              
              <button onClick = {navigateHome}>Go Home</button>
            </div>
        )
      } else if (user.data().role === 'VOLUNTEER'){
        return (
          <div>
            <Button className="bg-red-400"variant="contained"onClick={navigateHome}>Test Go home</Button>
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
            <ul>
               <li>Event 1</li>
               <li>Event 1</li>
               <li>Event 1</li>
               <li>Event 1</li>
               <li>Event 1</li>
          </ul>
          </div>
        );
      }
    }

}

export default Profile
