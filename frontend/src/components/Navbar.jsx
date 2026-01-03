import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { AdminNotifications } from './AdminNotifications'; // <--- 1. IMPORT AICI

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); // Luăm numărul de produse
  // Verificăm dacă e admin (suportă ambele formate de rol)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">MyShop</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Produse
              </Link>
              {isAdmin && (
                <div className="flex gap-4"> {/* Poți grupa link-urile de admin */}
                    <Link to="/admin" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                    Dashboard
                    </Link>
                    
                    {/* Link către Mesaje */}
                    <Link to="/admin/messages" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center">
                    Mesaje
                    <AdminNotifications /> 
                    </Link>
                </div>
                )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Coș</span>
                {/* SVG Icon Cart */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* Bulina roșie cu numărul */}
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {cartCount}
                    </span>
                )}
                </Link>
            {/* ... restul codului pentru logout ... */}
             <div className="text-sm text-gray-600 hidden md:block">
              Salut, <span className="font-semibold text-gray-900">{user?.role}</span>
            </div>
            <button onClick={logout} className="...">Log out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}