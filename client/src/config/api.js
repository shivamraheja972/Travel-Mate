import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tm_token');
      localStorage.removeItem('tm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
