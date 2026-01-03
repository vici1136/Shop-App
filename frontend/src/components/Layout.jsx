import React from 'react';
import Navbar from './Navbar';
import UserChat from './UserChat'; // <--- 1. Importă componenta
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();
  // Chat-ul apare doar pentru useri logați care NU sunt admini (opțional)
  const isCustomer = user && user.role !== 'ADMIN'; 

  return (
    <div className="min-h-screen bg-gray-50 relative"> {/* relative e important pt poziționare */}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {isCustomer && <UserChat />}
    </div>
  );
}