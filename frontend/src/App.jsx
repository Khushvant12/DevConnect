import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { TOKEN_KEY } from './config/constants.js';
import { SocketProvider } from './context/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import GuestRoute from './components/auth/GuestRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Developers from './pages/Developers.jsx';
import DeveloperProfile from './pages/DeveloperProfile.jsx';
import Feed from './pages/Feed.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import SavedProjects from './pages/SavedProjects.jsx';
import Chat from './pages/Chat.jsx';
import TeamRequests from './pages/TeamRequests.jsx';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

/** Logged-in users skip marketing home and land on the feed. */
function HomeRedirect() {
  const { loading, isAuthenticated, user } = useAuth();
  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));

  if (hasToken && (loading || !user)) {
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

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return <Home />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
        <SocketProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />

              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/developers"
                element={
                  <ProtectedRoute>
                    <Developers />
                  </ProtectedRoute>
                }
              />

              <Route path="/developers/:username" element={<DeveloperProfile />} />

              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <SavedProjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team-requests"
                element={
                  <ProtectedRoute>
                    <TeamRequests />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
