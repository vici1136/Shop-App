import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // <--- 1. Import useQueryClient
import api from '../api/axios';
import { useCart } from '../contexts/CartContext';

export default function ProductsPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // 2. FIX MAJOR: Trebuie să apelăm hook-ul pentru a avea acces la obiectul location
  const location = useLocation(); 
  
  // 3. Inițializăm queryClient pentru a putea da refresh la listă fără reload de pagină
  const queryClient = useQueryClient();

  // Verificăm ambele variante de rol pentru siguranță
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500 animate-pulse">Se încarcă produsele...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">Eroare la încărcarea produselor.</div>
      </div>
    );
  }

  async function handleDelete(id) {
    if (!confirm('Sigur dorești să ștergi acest produs?')) return;
    try {
      await api.delete(`/products/${id}`);
      
      // 4. FIX OPTIMIZARE: În loc de window.location.reload(), invalidăm cache-ul
      // React Query va refetch-ui automat lista de produse
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
    } catch (err) {
      alert('Eroare la ștergerea produsului.');
    }
  }

  return (
    <div>
      {/* Header Pagina */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Colecție Produse</h1>
          <p className="mt-1 text-sm text-gray-500">Explorează cele mai noi oferte și stocuri.</p>
        </div>

        {isAdmin && (
          <Link 
            to="/admin/products/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            + Adaugă Produs
          </Link>
        )}
      </div>

      {/* Grid Produse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => {
           // 1. Stabilim URL-ul imaginii. 
           const placeholderUrl = `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`;
           const imageUrl = product.imageUrl && product.imageUrl.trim() !== '' 
                ? product.imageUrl 
                : placeholderUrl;

           // Logica pentru etichete de stoc
           const isOutOfStock = product.stock === 0;
           const isLowStock = product.stock > 0 && product.stock < 5;

           return (
            <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
              
              {/* Secțiunea Imagine */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                 <img 
                   src={imageUrl} 
                   alt={product.name} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                   onError={(e) => {
                     e.target.onerror = null; 
                     e.target.src = placeholderUrl;
                   }}
                 />
                 
                 {/* Badge Stoc */}
                 <div className="absolute top-2 right-2 shadow-sm">
                    {isOutOfStock ? (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded border border-red-200">Stoc Epuizat</span>
                    ) : isLowStock ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded border border-yellow-200">Stoc Limitat</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded border border-green-200">In Stoc</span>
                    )}
                 </div>
              </div>

              {/* Secțiunea Conținut */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {product.price} <span className="text-sm font-normal text-gray-500">RON</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    Stoc: {product.stock} buc.
                  </p>
                </div>

                {/* Butoane Acțiune */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  {isAdmin ? (
                    <>
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        state={{ from: location.pathname }} // Acum funcționează pentru că avem variabila location
                        className="flex-1 text-center py-2 px-3 rounded bg-gray-50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-medium transition-colors"
                      >
                        Editează
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="flex-1 text-center py-2 px-3 rounded bg-gray-50 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Șterge
                      </button>
                    </>
                  ) : (
                    <button 
                      disabled={isOutOfStock}
                      onClick={() => addToCart(product)}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
                        ${isOutOfStock 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'}`}
                    >
                      {isOutOfStock ? 'Indisponibil' : 'Adaugă în coș'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}