import React, { createContext, useEffect, useState } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sft_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sft_token'));

  useEffect(() => {
    if (user) localStorage.setItem('sft_user', JSON.stringify(user));
    else localStorage.removeItem('sft_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('sft_token', token);
    else localStorage.removeItem('sft_token');
  }, [token]);

  // Attach token to axios
  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser({ _id: data._id, name: data.name, email: data.email });
    setToken(data.token);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    setUser({ _id: data._id, name: data.name, email: data.email });
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
