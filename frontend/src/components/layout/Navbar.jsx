import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Button from '../ui/Button.jsx';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? 'text-brand-600 dark:text-brand-400'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            DC
          </span>
          <span className="hidden sm:inline">DevConnect</span>
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/feed" className={linkClass}>
            Feed
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/chat" className={linkClass}>
                Chat
              </NavLink>
              <NavLink to="/team-requests" className={linkClass}>
                Team up
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/developers" className={linkClass}>
                Developers
              </NavLink>
              <NavLink to="/saved" className={linkClass}>
                Saved
              </NavLink>
            </>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:inline">
                @{user?.username}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
