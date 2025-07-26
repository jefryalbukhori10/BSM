// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // untuk auth
import { getStorage } from "firebase/storage"; // untuk penyimpanan file
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWRqaHyT2P2zz2FIDbuvBZGE4mEdd3Jsg",
  authDomain: "bsm-app-d6a11.firebaseapp.com",
  projectId: "bsm-app-d6a11",
  storageBucket: "bsm-app-d6a11.firebasestorage.app",
  messagingSenderId: "964675426871",
  appId: "1:964675426871:web:dc7aeb3609a408606e3db2",
  measurementId: "G-F3S56XYMFS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { collection, addDoc };
