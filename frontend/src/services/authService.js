import api from './api.js';

/**
 * Authentication API — maps to backend /api/auth routes.
 */
export const authService = {
  register: (payload) => api.post('/auth/register', payload),

  login: (payload) => api.post('/auth/login', payload),

  getMe: () => api.get('/auth/me'),
};
