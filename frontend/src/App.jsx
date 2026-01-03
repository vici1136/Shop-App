import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductFormPage from './pages/ProductFormPage';
import Layout from './components/Layout'; // Importă Layout-ul
import AdminChatPage from './pages/AdminChatPage';
import { CartProvider } from './contexts/CartContext'; // <--- Import
import  CartPage  from './pages/CartPage';

// Modificăm ProtectedPage să folosească Layout
function ProtectedPage({ page, allowed = [] }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Verificăm rolul (suportă și ROLE_ADMIN și ADMIN simplu)
  const userRole = user.role;
  const hasPermission = allowed.length === 0 || 
                        allowed.includes(userRole) || 
                        (userRole === 'ROLE_ADMIN' && allowed.includes('ADMIN'));

  if (allowed.length && !hasPermission) return <Navigate to="/" replace />;

  // Aici înfășurăm pagina în Layout
  return <Layout>{page}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* Rute protejate cu Meniu */}
            <Route path="/" element={<ProtectedPage page={<ProductsPage />} />} />
            <Route path="/admin" element={<ProtectedPage page={<AdminDashboard />} allowed={['ADMIN']} />} />
            <Route path="/admin/products/new" element={<ProtectedPage page={<ProductFormPage />} allowed={['ADMIN']} />} />
            <Route path="/admin/products/edit/:id" element={<ProtectedPage page={<ProductFormPage />} allowed={['ADMIN']} />} />
            <Route path="/admin/messages" element={<ProtectedPage page={<AdminChatPage />} allowed={['ADMIN']} />} />
            <Route path="/cart" element={<ProtectedPage page={<CartPage />} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}