import React from 'react'; // ← lipsa acestei linii
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/dashboard').then(res => res.data),
  });

  if (!stats) return <p>Se încarcă...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white p-4 rounded shadow">Total produse: <b>{stats.totalProducts}</b></div>
        <div className="bg-white p-4 rounded shadow">Total utilizatori: <b>{stats.totalUsers}</b></div>
        <div className="bg-white p-4 rounded shadow">Produse low-stock: <b>{stats.lowStock.length}</b></div>
      </div>
    </div>
  );
}