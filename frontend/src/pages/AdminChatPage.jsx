import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function AdminChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null); // Ținem doar ID-ul
  const [reply, setReply] = useState('');

  // 1. Încărcare realtime a listei
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sortăm să apară cele mai noi mesaje sau cele necitite primele
      chatsData.sort((a, b) => b.messages?.[b.messages.length-1]?.timestamp - a.messages?.[a.messages.length-1]?.timestamp);
      setChats(chatsData);
    });
    return () => unsub();
  }, []);

  // 2. Calculăm conversația activă pe baza ID-ului selectat
  // Asta rezolvă problema! Când 'chats' se schimbă, 'activeChat' se recalculează automat.
  const activeChat = chats.find(c => c.id === selectedChatId);

  // 3. Selectare chat
  const handleSelectChat = async (chatId) => {
    setSelectedChatId(chatId);
    
    // Marcăm ca citit
    const chat = chats.find(c => c.id === chatId);
    if (chat?.unreadAdmin) {
      await updateDoc(doc(db, "chats", chatId), { unreadAdmin: false });
    }
  };

  // 4. Trimitere răspuns
  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChatId) return;

    const chatRef = doc(db, "chats", selectedChatId);
    
    await updateDoc(chatRef, {
      messages: arrayUnion({
        text: reply,
        sender: 'admin',
        timestamp: new Date()
      }),
      unreadAdmin: false,
      unreadClient: true
    });

    setReply('');
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white shadow rounded-lg overflow-hidden border border-gray-200 mt-4">
      
      {/* SIDEBAR */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-4 bg-gray-100 border-b font-bold text-gray-700">Inbox Mesaje</div>
        <ul>
          {chats.map(chat => (
            <li 
              key={chat.id} 
              onClick={() => handleSelectChat(chat.id)}
              className={`p-4 cursor-pointer border-b transition-colors hover:bg-white 
                ${selectedChatId === chat.id ? 'bg-white border-l-4 border-l-indigo-600' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  {chat.userName || "Client Anonim"}
                </span>
                {chat.unreadAdmin && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">Nou</span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate mt-1">
                {chat.messages?.length > 0 
                  ? chat.messages[chat.messages.length - 1].text 
                  : 'Niciun mesaj'}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* CHAT AREA */}
      <div className="w-2/3 flex flex-col bg-white">
        {activeChat ? (
          <>
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">{activeChat.userName || "Client"}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 flex flex-col">
              {activeChat.messages?.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[70%] shadow-sm ${
                    m.sender === 'admin' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className="text-[10px] opacity-70 block text-right mt-1">
                      {m.timestamp?.seconds 
                        ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendReply} className="p-4 border-t bg-white flex gap-2">
              <input 
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Scrie un răspuns..."
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-medium">
                Trimite
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Selectează o conversație din stânga.
          </div>
        )}
      </div>
    </div>
  );
}