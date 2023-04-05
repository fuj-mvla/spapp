import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import {doc, getFirestore, setDoc, collection, where, query,getDoc,deleteDoc,getDocs} from 'firebase/firestore';
import {app} from '../../firebase';
import { TextField } from '@mui/material';
import {Button} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {useNavigate} from 'react-router-dom';
import Navbar from './../../components/Navbar/Navbar';

const db = getFirestore(app);

const Profile = ({authUser}) => {
 
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.email));

  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [location,setLocation] = useState('');
  const[phone,setPhone] = useState([]);
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
  const [snap, loading3, error3] = useCollection(
    query(
      collection(db, 'Volunteering'),
      where('userid','==',authUser.uid)
      
    )
  );
  const navigate = useNavigate();
  const navigateHome =()=>{
    navigate("/")
  }
  const navigateProfile =()=>{
    navigate("/profile")
  }
  const navigateCoach =()=>{
    navigate("/coaches")
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
      case 'phone':
        setPhone(event.target.value);
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

  const cancelEvent=async({id})=>{
 
    await deleteDoc(doc(db,"Events",id))
    const ref = collection(db,"Volunteering");
    const q = query(ref,where("eventid","==",id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
     
      await deleteDoc(doc);
});
  }

  const joinEvent=async (id)=>{
    const docRef = doc(db, "Events", id);
    const docSnap = await getDoc(docRef);
    await setDoc((doc(db, "Volunteering",id)),
    {
      eventid:docSnap.data().__id,
      userid: authUser.uid,
      description: docSnap.data().description,
      location: docSnap.data().location,
      title:docSnap.data().title,
      startTimeStamp:docSnap.data().startTimeStamp
    }).then(() => {
      console.log("Document successfully written!");
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
   
  }
  const deleteEvent = async(id)=>{
    const docRef = doc(db, "Volunteering", id);
   
    await deleteDoc(docRef);

  }
  const updatePhone=async ()=>{
    await setDoc(doc(db,"users",authUser.email),{phone:phone},{merge:true})
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
            <div className="relative ">
              <Navbar navigate={navigateHome} navigateP={navigateProfile} navigateC={navigateCoach}/>
              <div className="relative   text-center ">
              <TextField
                id="activity-name"
                label="Name of Activity"
                value={activityName}
                variant="outlined"
                onChange={handleFormData}
              />
              <div className="p-1"></div>
              <TextField
                id="description-of-event"
                label="Description of event"
                value={description}
                variant="outlined"
                onChange={handleFormData}
              />
                <div className="p-1"></div>
              <TextField 
              id = "loc"
              label="Location"
              value= {location}
              variant="outlined"
              onChange={handleFormData}
              />
              <br className="pb-2"></br>
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
              <div className="p-1 text-2xl"> Update your Phone Number</div>
               <TextField 
              id = "phone"
              label="Enter Phone Number"
              value= {phone}
              variant="outlined"
              onChange={handleFormData}
              />
              <br></br>
              <button className="rounded-md h-8 w-32 bg-red-500 text-white text-xs" onClick={updatePhone}>Update Phone Number</button>
              </div>
              <div className="relative  text-center ">
              <div>Activity name: {activityName }</div>
              <div>Description: {description || '(empty)'}</div>
            <div>Location: {location|| '(empty)'}</div>
            
              <div>Date and time: {dateAndTime.toDate().toString() || '(empty)'}</div>
              <button className="rounded-md h-8 w-32 bg-red-500 text-white text-xs"onClick={saveFormData}>ENTER</button>
              <div>Phone Number: {phone}</div>
              
              </div>
             
              <div className='relative text-center text-3xl'>Events Created:</div>
                {snapshot && (
                <span>
                 
                  {snapshot.docs.map((doc, i) => (
                    <div className="relative text-center"key={doc.id}>
                    
                      <div className="text-2xl ">Event Name: {doc.data().title}</div>
                      <div>Time and Date: {doc.data().startTimeStamp.toDate().toString()}</div>
                      <div>Location: {doc.data().location}</div>
                      
                      <button className="rounded-md h-8 w-32 bg-red-500 text-white text-xs " onClick={()=>cancelEvent(doc)}>Cancel Event</button>
                   
                      
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
          
               <div className="text-center">
             
             <br></br>
            <label className = "pr-1"for="roles">Please select which role you are</label>
            <select className="bg-orange-50 outline-1 rounded-md" name = "roles" id ="role">
             
              <option value="volunteer">Volunteer</option>
             <option value="coach">Coach</option>
               <option value="athlete">Athlete</option>
             </select>
             <br></br>
             <button className=" rounded-md hover:bg-red-600 h-12 w-40 bg-red-500 text-white text-sm "onClick={updateRoles}>CHANGE ROLES</button>
             </div>
            </div>
        )
      } else if (user.data().role === 'VOLUNTEER'|| user.data().role === 'ATHLETE'){
        return (

          <div className="relative  ">
           <Navbar navigate={navigateHome} navigateP={navigateProfile}  navigateC={navigateCoach}/>
          <div className="relative text-center">
            {snapshot2 && (
                <span>
                  <div className="text-4xl font-mono">Events coming up:</div>
                  {snapshot2.docs.map((doc, i) => (
                    <div className="relative    "key={doc.id}>
                    
                        <div className="relative text-2xl pb-1  ">Event Name: {doc.data().title}   </div>
                        <div>Location: {doc.data().location}</div>
                     
                      <button className = "hover:bg-red-600 text-white  w-24 rounded-md bg-red-500 relative top-0 left-1 pb-1" onClick={()=>joinEvent(doc.data().__id)}>Sign up</button>
                      
                      
                     
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
              <div className="text-4xl font-mono pt-20 pb-20">Events you have signed up for:</div>
          
              {snap && (
                <span>
              
                  {snap.docs.map((doc, i) => (
                    <div className= "pb-5"key={doc.id}>
                    
                      <div className="text-2xl pb-1">Event Name: {doc.data().title}  </div>
                      <div>Location: {doc.data().location}</div>
                      <button className = "outline hover:bg-red-500 outline-2 text-white outline-red-500 w-24 rounded-md bg-red-400 relative top-0 left-0 " onClick={()=>deleteEvent(doc.data().eventid)}>Leave Event</button>
                    
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
              
            <div className="relative ">
              <div className="">
            <label for="roles">Please select which role you are</label>
            <select className="outline outline-red-400 outline-1" name = "roles" id ="role">
             
              <option value="volunteer">Volunteer</option>
             <option value="coach">Coach</option>
               <option value="athlete">Athlete</option>
             </select>
             </div>
             <br></br>
             <button className=" relative rounded-md h-12 w-40 bg-red-500 text-white text-sm"onClick={updateRoles}>CHANGE ROLES</button>
                    
             
             </div>
             </div>
          </div>
          
        );
      }
    }

}

export default Profile
