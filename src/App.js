import './App.css';
import { app } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function App() {

  const [authUser, loadingAuth, errorAuth] = useAuthState(auth);

  if (loadingAuth) {
    // still loading
    return (
      <div>still loading...</div>
    );
  }

  if (!authUser) {
    // user not logged in
    return (
      <div className="App">
        <button onClick={logInUser}>Sign in</button>
      </div>
    );
  } else if (authUser) {
    // user is logged in

    return (
      <div className= "App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home authUser={authUser} />} />
          </Routes>
          <Routes>
            <Route path="/profilesd" element={<Profile authUser={authUser} />} />
          </Routes>
          <Routes>
            
          </Routes>
          
        </BrowserRouter>
      </div>
    );
  }
}

const logInUser = () => {
  console.log('logInUser was called');
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;

      // set user document in firestore
      await setDoc(doc(db, 'users', user.uid), {

        _id: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'VOLUNTEER',
      });

    }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
};

export default App;
