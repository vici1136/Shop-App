import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('id');
    
    return token ? { token, role, username, id } : null;
  });

  // Modificăm funcția login să accepte tot obiectul userData
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('id', userData.id);
    
    setUser({ 
        token, 
        role: userData.role, 
        username: userData.username, 
        id: userData.id 
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location = '/login';
  };

  axios.interceptors.request.use(cfg => {
    if (user?.token) cfg.headers.Authorization = `Bearer ${user.token}`;
    return cfg;
  });

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};