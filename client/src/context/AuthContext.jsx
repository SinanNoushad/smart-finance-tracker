import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sft_user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('sft_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('sft_token');
        if (storedToken) {
          // Optionally validate the token with the server here
          const { data } = await api.get('/auth/profile');
          setUser(data); // The profile endpoint returns the user object directly
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // Don't show error to user if token is invalid/expired
        // The API interceptor will handle redirecting to login
        localStorage.removeItem('sft_token');
        localStorage.removeItem('sft_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update localStorage when user or token changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('sft_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sft_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sft_token', token);
    } else {
      localStorage.removeItem('sft_token');
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    // Clear all auth data
    setUser(null);
    setToken(null);
    // The API interceptor will handle redirecting to login
    localStorage.removeItem('sft_token');
    localStorage.removeItem('sft_user');
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
