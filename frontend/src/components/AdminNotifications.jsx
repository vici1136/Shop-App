import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Asigură-te că calea e corectă
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function AdminNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Ascultăm mesajele care au unreadAdmin = true
    const q = query(collection(db, "chats"), where("unreadAdmin", "==", true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
      
      // Opțional: sunet
      if (snapshot.size > 0) {
        // Poți decomenta linia de mai jos dacă adaugi un fișier sunet
        // new Audio('/notification.mp3').play().catch(() => {}); 
      }
    });

    return () => unsubscribe();
  }, []);

  if (unreadCount === 0) return null;

  return (
    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse ml-2">
      {unreadCount} noi
    </span>
  );
}