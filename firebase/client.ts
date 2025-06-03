// Import the functions you need from the SDKs you need
import { initializeApp,getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVSyYFWAWAU0BAgOd7g-n1y6A-PHz9B_s",
    authDomain: "prepwise-58859.firebaseapp.com",
    projectId: "prepwise-58859",
    storageBucket: "prepwise-58859.firebasestorage.app",
    messagingSenderId: "374891765819",
    appId: "1:374891765819:web:e6f28a7dbf90d56f75fc1e",
    measurementId: "G-0VM2J2YF46"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig): getApp();
export const auth = getAuth(app)
export const db = getFirestore()
