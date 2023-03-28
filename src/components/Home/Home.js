import {useDocument} from 'react-firebase-hooks/firestore';
import {doc, getFirestore} from 'firebase/firestore';
import {app} from '../../firebase';
import {Routes, Route, useNavigate} from 'react-router-dom';
const db = getFirestore(app);

const Home = ({authUser}) => {
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.uid));
  const navigate = useNavigate();

  const navigateToContacts = () => {
    // 👇️ navigate to /contacts
    
    navigate('/profile');
  };
  if (user) {
    return (
      <div>
        Welcome {user.data().name}!
        <button onClick={navigateToContacts}>Contacts</button>

      </div>
    );
  } else {
    return (

      <div>No user!
      </div>

    );
  }
};

export default Home;
