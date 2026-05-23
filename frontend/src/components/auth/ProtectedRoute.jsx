import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { TOKEN_KEY } from '../../config/constants.js';

/**
 * Guards private routes.
 * - No JWT in localStorage → redirect to /login
 * - Token present but session loading → spinner
 * - Authenticated → render children
 */
export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));

  if (loading && hasToken) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!hasToken || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
