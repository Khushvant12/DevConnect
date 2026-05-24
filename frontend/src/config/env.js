/**
 * Environment URL resolution (no import.meta — safe for Vite config import).
 */

export const PRODUCTION_API_BASE = 'https://devconnect-backend-opz0.onrender.com/api';
export const PRODUCTION_SOCKET_URL = 'https://devconnect-backend-opz0.onrender.com';
export const DEVELOPMENT_API_BASE = 'http://localhost:5000/api';
export const DEVELOPMENT_SOCKET_URL = 'http://localhost:5000';

const stripTrailingSlash = (value) => String(value).replace(/\/+$/, '');

/**
 * Normalize to exactly one `/api` suffix (never `/api/api`, never missing `/api`).
 * Relative values (e.g. `/api`) are rejected — use an absolute backend origin.
 */
export function resolveApiBaseUrl(raw, isProduction = false) {
  const fallback = isProduction ? PRODUCTION_API_BASE : DEVELOPMENT_API_BASE;

  if (!raw?.trim()) {
    return fallback;
  }

  const trimmed = raw.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return fallback;
  }

  const origin = stripTrailingSlash(trimmed).replace(/\/api\/?$/i, '');
  if (!origin || origin === 'undefined') {
    return fallback;
  }

  return `${origin}/api`;
}

/**
 * Socket origin — same host as API, without `/api`.
 */
export function resolveSocketUrl(raw, isProduction = false) {
  const fallback = isProduction ? PRODUCTION_SOCKET_URL : DEVELOPMENT_SOCKET_URL;

  if (!raw?.trim()) {
    return fallback;
  }

  const trimmed = raw.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return fallback;
  }

  const origin = stripTrailingSlash(trimmed).replace(/\/api\/?$/i, '');
  if (!origin || origin === 'undefined') {
    return fallback;
  }

  return origin;
}
