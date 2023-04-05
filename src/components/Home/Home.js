import {useDocument} from 'react-firebase-hooks/firestore';
import {doc, getFirestore} from 'firebase/firestore';
import {app} from '../../firebase';
import {useNavigate} from 'react-router-dom';
import Button from '../Button/Button';
import "./Home.css";
import Navbar from './../../components/Navbar/Navbar'
const db = getFirestore(app);

const Home = ({authUser}) => {
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.email));
  const navigate = useNavigate();

  const navigateToProfile = () => {
    // 👇️ navigate to /contacts

    
    navigate('/profile');

  };
  const navigateHome = () => {
    // 👇️ navigate to /contacts

    
    navigate('/');

  };
  const navigateCoach = () => {
    // 👇️ navigate to /contacts

    console.log("here");
    navigate('/coaches');

  };
  if (user) {
   
    if (user.data().role==='COACH'){
      return(
        <div className="relative ">
           <Navbar navigate={navigateHome} navigateP={navigateToProfile} navigateC={navigateCoach}/>
           <div className="relative text-center right-24">
          <div className="text-3xl font-bold pb-4">Welcome {user.data().name}</div>
          <button className="text-white rounded-md w-40 h-12 bg-red-400 "onClick={navigateToProfile}>CREATE EVENTS</button>
      </div>
      </div>
      );
      
    }
    else{
      return(
        
     
      <div className="relative ">
        <Navbar navigate={navigateHome} navigateP={navigateToProfile} navigateC={navigateCoach}/>
        <div className="relative text-center right-24">
         <p className="  text-2xl pb-8 ">Welcome {user.data().name}</p>
          <button className="  bottom-1/2 left-0  text-white rounded-md     w-40 h-12 bg-red-400 "onClick={navigateToProfile}>SIGN UP FOR EVENTS</button>
          </div>
        </div>
      );
    }
    
  } else {
    return (

      <div>No user!</div>

    );
  }
};

export default Home;