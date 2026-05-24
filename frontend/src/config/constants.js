/**
 * Centralized frontend config — API, Socket, storage keys.
 */
import {
  resolveApiBaseUrl,
  resolveSocketUrl,
} from './env.js';

const isProd = import.meta.env.PROD;

export const API_BASE_URL = resolveApiBaseUrl(
  import.meta.env.VITE_API_URL,
  isProd
);

/** Backend origin without `/api` (for error messages, links). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, '');

export const SOCKET_URL = resolveSocketUrl(
  import.meta.env.VITE_SOCKET_URL,
  isProd
);

export const TOKEN_KEY = 'devconnect_token';
export const USER_KEY = 'devconnect_user';

if (import.meta.env.DEV) {
  console.info('[DevConnect] API_BASE_URL:', API_BASE_URL);
  console.info('[DevConnect] SOCKET_URL:', SOCKET_URL);
}

if (isProd && !API_BASE_URL.startsWith('http')) {
  console.error(
    '[DevConnect] Invalid API_BASE_URL in production build:',
    API_BASE_URL
  );
}
