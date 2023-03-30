import {useDocument} from 'react-firebase-hooks/firestore';
import {doc, getFirestore} from 'firebase/firestore';
import {app} from '../../firebase';
import {useNavigate} from 'react-router-dom';
import Button from '../Button/Button';
import "./Home.css";

const db = getFirestore(app);

const Home = ({authUser}) => {
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.uid));
  const navigate = useNavigate();

  const navigateToProfile = () => {
    // 👇️ navigate to /contacts

    
    navigate('/profile');

  };
  if (user) {
    
    if (user.data().role==='COACH'){
      return(
        <div>
          <div>Welcome {user.data().name}</div>
          <button onClick={navigateToProfile}>CREATE EVENTS</button>
      </div>
      );
      
    }
    else{
      return(
      <div>
         <div className="text-3xl">Welcome {user.data().name}</div>
          <button className="outline rounded-full h-12 bg-red-400"onClick={navigateToProfile}>SIGN UP FOR EVENTS</button>
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
