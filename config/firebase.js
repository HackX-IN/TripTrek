// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {getFirestore, collection} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBmgL9W8HlgTIZFv1hgqIIGLjCwT8t1vi4',
  authDomain: 'tripplanner-22740.firebaseapp.com',
  projectId: 'tripplanner-22740',
  storageBucket: 'tripplanner-22740.appspot.com',
  messagingSenderId: '496672671776',
  appId: '1:496672671776:web:03a67d221f8b5d6f639445',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export {auth, db};
export const tripsRef = collection(db, 'trips');
export const expensesRef = collection(db, 'expenses');

export default app;
