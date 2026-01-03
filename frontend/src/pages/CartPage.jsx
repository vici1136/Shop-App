import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
// 👇 1. IMPORT OBLIGATORIU
import { useQueryClient } from '@tanstack/react-query'; 

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 👇 2. INIȚIALIZARE CLIENT
  const queryClient = useQueryClient();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
        alert("Trebuie să fii logat pentru a finaliza comanda.");
        navigate('/login');
        return;
    }

    if (!confirm(`Confirmi comanda în valoare de ${total.toFixed(2)} RON?`)) return;

    try {
      const orderData = {
          items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      };

      // Trimitem comanda la backend
      await api.post('/orders', orderData);

      // 👇 3. REÎMPROSPĂTARE STOC (Cheia magică)
      // Această linie șterge memoria cache pentru 'products' și obligă ProductsPage
      // să ceară din nou datele din baza de date (unde stocul e deja scăzut).
      await queryClient.invalidateQueries({ queryKey: ['products'] });

      alert('Comanda a fost plasată cu succes!');
      clearCart();
      navigate('/'); 
      
    } catch (err) {
      console.error(err);
      alert('Eroare la plasarea comenzii. ' + (err.response?.data || ''));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Coșul tău este gol</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Îneapoi la cumpărături
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg mt-10">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Coș de Cumpărături</h1>
      </div>

      <ul className="divide-y divide-gray-200">
        {cart.map((item) => (
          <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <img 
                src={item.imageUrl || `https://placehold.co/100?text=${item.name}`} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded border"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price} RON x {item.quantity} buc.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-bold text-indigo-600">
                {(item.price * item.quantity).toFixed(2)} RON
              </span>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Șterge
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-gray-50 px-4 py-5 sm:px-6 border-t border-gray-200 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">
          Total: <span className="text-indigo-600">{total.toFixed(2)} RON</span>
        </div>
        
        <button
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium shadow-md transition-colors"
        >
          Finalizează Comanda
        </button>
      </div>
    </div>
  );
}