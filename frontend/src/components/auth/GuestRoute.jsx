import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { TOKEN_KEY } from '../../config/constants.js';

/**
 * Redirects logged-in users away from /login and /register.
 */
function AuthLoading() {
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

export default function GuestRoute({ children }) {
  const { loading, isAuthenticated, user } = useAuth();
  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));

  if (hasToken && (loading || !user)) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}
