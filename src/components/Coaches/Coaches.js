import { getFirestore, doc, setDoc,collection,query,getDocs,where, } from 'firebase/firestore';
import { app } from '../../firebase';
import Navbar from '../Navbar/Navbar';
import {useNavigate} from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
const db=getFirestore(app)

const Coaches =()=>{
  const [snapshot, loading, error] = useCollection(
    query(
      collection(db, 'users'),
      where('role','==','COACH'),
      
      
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
   
    
    return (
        <div>
        <Navbar navigate={navigateHome} navigateP={navigateProfile} navigateC={navigateCoach}/>
        <div className="text-center">
        {snapshot && (
                <span>
                  <div className="text-4xl font-mono pb-3">Coaches of Northern California:</div>
                  {snapshot.docs.map((doc, i) => (
                    <div className="relative    "key={doc.id}>
                    
                        <div className="relative text-2xl pb-4  ">Coach: {doc.data().name}  </div>
                        <div>Email: {doc.data().email} </div> 
                        <div>Phone: {doc.data().phone}</div>
                    <br></br>
                    </div>
                  ))}
                </span>
              )}
              </div>
        </div>
         );

    
}

export default Coaches