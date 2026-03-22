import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://soul-full-backend.onrender.com/api';

const getStoredToken = () => {
  const raw = localStorage.getItem('sit_admin_token');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return raw;
  }
};

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sit_admin_token');
      localStorage.removeItem('sit_admin_user');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

const getAssetUrl = path => {
  if (!path) {
    return '';
  }
  const base = API_BASE.replace(/\/api\/?$/, '');
  return `${base}${path}`;
};

export { api, API_BASE, getAssetUrl };
