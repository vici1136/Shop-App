import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  res => res,
  err => {
    // Tratăm doar 401 pentru logout automat (token expirat/lipsă)
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location = '/login';
    }
    
    // Pentru 403 (Forbidden), NU facem logout, doar propagăm eroarea
    // Astfel userul rămâne logat și vede un mesaj de eroare în pagină
    return Promise.reject(err);
  }
);

export default api;