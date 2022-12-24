// import logo from './logo.svg';
import './App.css';
import { app } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {

  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    // still loading
    return (
      <div>still loading...</div>
    );
  }

  if (!user) {
    // user not logged in
    return (
      <div className="App">
        <button onClick={logInUser}>Sign in</button>
      </div>
    );
  } else if (user) {
    // user is logged in
    return (
      <div>Welcome {user.displayName}!</div>
    );
  }
}

export default App;

const logInUser = () => {
  console.log('logInUser was called');
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
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

// <header className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//   <p>
//     Edit <code>src/App.js</code> and save to reload.
//   </p>
//
//   <a
//     className="App-link"
//     href="https://reactjs.org"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     Learn React
//   </a>
// </header>
