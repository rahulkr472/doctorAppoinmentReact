// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWAqT6YGWlZ6VDzLVZmdI96jsK9ZH1TWo",
  authDomain: "doctorappoint-458c0.firebaseapp.com",
  projectId: "doctorappoint-458c0",
  storageBucket: "doctorappoint-458c0.firebasestorage.app",
  messagingSenderId: "77082512757",
  appId: "1:77082512757:web:9101d96cd0759c5b8f573c",
  measurementId: "G-KEWPQ8RMG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);