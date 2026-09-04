import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const DEMO_USERS = {
  Admin: { email: 'admin@capacity.com', password: 'admin123', label: 'Demo Admin (Eleanor)' },
  Trainer: { email: 'trainer.john@capacity.com', password: 'trainer123', label: 'Demo Trainer (Dr. John)' },
  Trainee: { email: 'trainee.alex@capacity.com', password: 'trainee123', label: 'Demo Trainee (Alex Rivera)' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('capacity_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Session expired or error fetching profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('capacity_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('capacity_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const demoLogin = async (role) => {
    const creds = DEMO_USERS[role];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  const logout = () => {
    localStorage.removeItem('capacity_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
