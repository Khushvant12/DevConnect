/**
 * Central config for API and auth storage keys.
 * Change VITE_API_URL in .env for production (e.g. Render backend URL).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const TOKEN_KEY = 'devconnect_token';
export const USER_KEY = 'devconnect_user';
