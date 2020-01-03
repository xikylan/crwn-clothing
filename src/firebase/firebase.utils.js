import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyByEDEn3kYRwveJwvS5pPBxmZ7Z_lLTKj0',
  authDomain: 'crwn-db-744ef.firebaseapp.com',
  databaseURL: 'https://crwn-db-744ef.firebaseio.com',
  projectId: 'crwn-db-744ef',
  storageBucket: 'crwn-db-744ef.appspot.com',
  messagingSenderId: '134468982497',
  appId: '1:134468982497:web:7a35cd9e8007fc1985c9a0',
  measurementId: 'G-0C8N8CHDD9'
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapshot = await userRef.get();

  console.log(snapshot);

  // check if there is any data
  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    // create new user
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
