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
    return 'Cannot reach the server. Is the backend running on http://localhost:5000?';
  }

  return fallback;
}
