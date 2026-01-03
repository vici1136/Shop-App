import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 1. Obținem locația curentă
  // Inițializăm și imageUrl
  const [form, setForm] = useState({ name: '', price: '', stock: '', imageUrl: '' });

  const from = location.state?.form || '/'; // 2. Verificăm dacă există o stare transmisă
  useEffect(() => {
    if (id) {
        api.get(`/products/${id}`).then(res => {
            // Backend-ul trimite null dacă nu e imagine, noi vrem string gol în input
            const data = res.data;
            setForm({ 
                ...data, 
                imageUrl: data.imageUrl || '' 
            });
        });
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const dto = { 
        ...form, 
        price: parseFloat(form.price), 
        stock: parseInt(form.stock) 
    };
    
    try {
        if (id) await api.put(`/products/${id}`, dto);
        else await api.post('/products', dto);
        navigate(from); // folosim from pentru redirecționare
    } catch (err) {
        alert('Eroare la salvarea produsului.');
    }    
    
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{id ? 'Editează' : 'Adaugă'} produs</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
        
        {/* Previzualizare Imagine */}
        {form.imageUrl && (
            <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Previzualizare:</p>
                <img src={form.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded border" 
                     onError={(e) => e.target.style.display = 'none'} />
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-gray-700">Nume Produs</label>
            <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" 
                   value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Preț (RON)</label>
                <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2" 
                       type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Stoc</label>
                <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2" 
                       type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">URL Imagine</label>
            <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-gray-600" 
                   placeholder="https://exemplu.com/poza.jpg"
                   value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <p className="text-xs text-gray-500 mt-1">Lăsați gol pentru imaginea implicită.</p>
        </div>

        <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            Salvează Produsul
        </button>
      </form>
    </div>
  );
}