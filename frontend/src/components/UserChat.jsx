import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';

export default function UserChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // Stare nouă pentru notificare
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) return;
    const chatId = `user_${user.id}`;
    
    const unsub = onSnapshot(doc(db, "chats", chatId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages || []);
        
        // Verificăm dacă sunt mesaje necitite pentru client
        setHasUnread(data.unreadClient === true);
      }
    });
    return () => unsub();
  }, [user]);

  // Funcție care marchează mesajele ca citite când deschidem chatul
  const openChat = async () => {
    setIsOpen(true);
    if (hasUnread && user) {
      const chatId = `user_${user.id}`;
      try {
        await updateDoc(doc(db, "chats", chatId), {
          unreadClient: false // Resetăm notificarea
        });
      } catch (err) {
        console.error("Err marking read:", err);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const chatId = `user_${user.id}`;
    const chatRef = doc(db, "chats", chatId);
    
    const newMessage = {
      text: input,
      sender: 'client',
      timestamp: new Date()
    };

    try {
      const docSnap = await getDoc(chatRef);
      if (!docSnap.exists()) {
        await setDoc(chatRef, { 
            messages: [newMessage], 
            unreadAdmin: true, 
            unreadClient: false,
            userName: user.username || `User ${user.id}` 
        });
      } else {
        await updateDoc(chatRef, {
          messages: arrayUnion(newMessage),
          unreadAdmin: true,
          unreadClient: false
        });
      }
      setInput('');
    } catch (error) {
      console.error("Eroare:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-xl flex flex-col border border-gray-200 mb-4 overflow-hidden animate-fade-in-up">
          <div className="bg-indigo-600 p-3 text-white flex justify-between items-center">
            <span className="font-semibold">Suport Live</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-4">Scrie-ne un mesaj...</p>}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-lg max-w-[80%] text-sm shadow-sm ${
                      m.sender === 'client' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
              </div>
            ))}
             {/* Auto-scroll la ultimul mesaj ar fi util aici */}
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Scrie un mesaj..." 
            />
            <button type="submit" className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700">
              ➢
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button 
            onClick={openChat} // <--- Folosim funcția nouă openChat
            className="relative bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        >
          {/* Bulina Roșie de Notificare */}
          {hasUnread && (
            <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/4 translate-x-1/4 rounded-full bg-red-500 border-2 border-white"></span>
          )}
          
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
      )}
    </div>
  );
}