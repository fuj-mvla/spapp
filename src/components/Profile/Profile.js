import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import {doc, getFirestore, setDoc, collection, where, query} from 'firebase/firestore';
import {app} from '../../firebase';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Routes, Route, useNavigate} from 'react-router-dom';
const db = getFirestore(app);

const Profile = ({authUser}) => {
  const navigate = useNavigate();
  const navigateHome =()=>{
    navigate("/")
  }
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.uid));

  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [dateAndTime, setDateAndTime] = useState(dayjs('2014-08-18T21:11:54'));
  // Note: here's an example of how to run a query
  const [snapshot, loading, error] = useCollection(
    query(
      collection(db, 'Events'),
      where('_coachId', '==', authUser.uid),
    )
  );

  const handleFormData = (event) => {
    switch (event.target.id) {
      case 'activity-name':
        setActivityName(event.target.value);
        break;
      case 'description-of-event':
        setDescription(event.target.value);
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
                variant="outlined"
                onChange={handleFormData}
              />
              <TextField
                id="description-of-event"
                label="Description of event"
                value={description}
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
              <div>Date and time: {dateAndTime.toDate().toString() || '(empty)'}</div>
              <button onClick={saveFormData}></button>
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
      } else if (user.data().role == 'VOLUNTEER'){
        return (
          <ul>
            <li>Event 1</li>
            <li>Event 1</li>
            <li>Event 1</li>
            <li>Event 1</li>
            <li>Event 1</li>
          </ul>
        );
      }
    }

}

export default Profile
