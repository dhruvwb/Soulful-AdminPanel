import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const parseStored = raw => {
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return raw;
    }
  };

  const [user, setUser] = useState(() => parseStored(localStorage.getItem('sit_admin_user')));
  const [token, setToken] = useState(() => parseStored(localStorage.getItem('sit_admin_token')));

  useEffect(() => {
    localStorage.setItem('sit_admin_user', JSON.stringify(user));
    localStorage.setItem('sit_admin_token', JSON.stringify(token));
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      setUser(response.data.user);
      setToken(response.data.token);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      return { ok: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
