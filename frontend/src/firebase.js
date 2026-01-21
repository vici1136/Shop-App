import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// 👇 PUNE DATELE REALE AICI (doar pentru test)
const firebaseConfig = {
  apiKey: "AIzaSyBI8S4mMrd3pv8NnYLzghGjTfBJovx3Hw0",
  authDomain: "shop-chat-77d5e.firebaseapp.com",
  projectId: "shop-chat-77d5e",
  storageBucket: "shop-chat-77d5e.firebasestorage.app",
  messagingSenderId: "917718397511",
  appId: "1:917718397511:web:d38869608ae31cf73cb762",
  measurementId: "G-WX3LP77HVL"
};
const app = initializeApp(firebaseConfig);

// Păstrăm setarea pentru conexiune stabilă
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

console.log("Firebase conectat la proiectul:", firebaseConfig.projectId);