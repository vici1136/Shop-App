import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// 👇 PUNE DATELE REALE AICI (doar pentru test)
const firebaseConfig = {
  apiKey: "AIzaSyB7GUNQER2jkCxWGzDgrxkwje-NjKf3KE4",
  authDomain: "shopchat-48c0a.firebaseapp.com",
  projectId: "shopchat-48c0a",
  storageBucket: "shopchat-48c0a.firebasestorage.app",
  messagingSenderId: "893741054544",
  appId: "1:893741054544:web:2c6222ee995c6a5a9daf55",
  measurementId: "G-CW37R6H1QJ"
};
const app = initializeApp(firebaseConfig);

// Păstrăm setarea pentru conexiune stabilă
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

console.log("Firebase conectat la proiectul:", firebaseConfig.projectId);