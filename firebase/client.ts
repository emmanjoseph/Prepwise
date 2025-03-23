// Import the functions you need from the SDKs you need
import { getApps ,initializeApp,getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAv4QuXIlm-vbaVEZ4wuISF_JdstkHUmTA",
  authDomain: "prepwise-a33f1.firebaseapp.com",
  projectId: "prepwise-a33f1",
  storageBucket: "prepwise-a33f1.firebasestorage.app",
  messagingSenderId: "44149705958",
  appId: "1:44149705958:web:8de3bdf8e05f1d5673bf27",
  measurementId: "G-TWDDJJYDG6"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)