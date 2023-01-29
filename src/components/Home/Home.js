import {useDocument} from 'react-firebase-hooks/firestore';
import {doc, getFirestore} from 'firebase/firestore';
import {app} from '../../firebase';
const db = getFirestore(app);

const Home = ({authUser}) => {
  const [user, loadingUser, errorUser] = useDocument(doc(db, 'users', authUser.uid));

  if (user) {
    return (
      <div>Welcome {user.data().name}!</div>
    );
  } else {
    return (
      
      <div>No user!
      </div>
      
    );
  }
};

export default Home;
