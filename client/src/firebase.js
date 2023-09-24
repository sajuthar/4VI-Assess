import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {getStorage,ref,uploadBytes} from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyBWS4ALbIhSmEC_F-3mRRkDcVy9sHpHhwA",
  authDomain: "authentication-ff0ac.firebaseapp.com",
  projectId: "authentication-ff0ac",
  storageBucket: "authentication-ff0ac.appspot.com",
  messagingSenderId: "121450338545",
  appId: "1:121450338545:web:627e670de3a62eefa23150"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app)
