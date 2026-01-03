import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await api.post('/auth/login', { username, password });
        
        // Presupunem că backend-ul returnează: { token: "...", role: "...", username: "...", id: 1 }
        // Dacă backend-ul nu trimite ID și Username, va trebui să decodăm token-ul (JWT), 
        // dar pentru moment încercăm să le luăm din răspuns.
        
        const userData = {
          role: data.role,
          username: data.username || username, // Fallback la ce a scris in input
          id: data.id || '0' // Un ID temporar dacă backend-ul nu îl trimite
        };

        login(data.token, userData); 
        navigate('/');
      } catch (err) {
        alert(err.response?.data || 'Login eșuat');
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-6 px-3 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign in
        </button>
      </form>
    </div>
  );
}