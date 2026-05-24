import { API_ORIGIN } from '../config/constants.js';

/**
 * Extract a user-friendly message from Axios / API errors.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  const data = error.response?.data;

  if (data?.message) return data.message;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg || e.message).filter(Boolean).join('. ');
  }

  if (error.message === 'Network Error') {
    return `Cannot reach the server. Check that the API is available at ${API_ORIGIN}.`;
  }

  return fallback;
}
