import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../config/constants.js';

/**
 * Shared Axios instance for all DevConnect API calls.
 * - baseURL points to Express /api
 * - withCredentials sends cookies if backend uses them later
 * - Request interceptor attaches JWT from localStorage
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthAttempt =
      url.includes('/auth/login') || url.includes('/auth/register');

    // Expired or invalid token on protected routes — clear session
    if (status === 401 && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
