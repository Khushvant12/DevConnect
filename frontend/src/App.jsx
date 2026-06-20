import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { TOKEN_KEY } from './config/constants.js';
import { SocketProvider } from './context/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import GuestRoute from './components/auth/GuestRoute.jsx';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Developers = lazy(() => import('./pages/Developers.jsx'));
const DeveloperProfile = lazy(() => import('./pages/DeveloperProfile.jsx'));
const Feed = lazy(() => import('./pages/Feed.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const SavedProjects = lazy(() => import('./pages/SavedProjects.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const TeamRequests = lazy(() => import('./pages/TeamRequests.jsx'));

function AppLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 transition-colors duration-300 dark:bg-[#030712]">
      {/* Background radial glow lights & grid patterns for high-tech aesthetics */}
      <div className="absolute inset-0 bg-mesh-glow dark:bg-mesh-glow-dark pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-[0.4] dark:opacity-[0.25] -z-10" />
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
            <Suspense
              fallback={
                <div className="flex min-h-[50vh] items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
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
            </Suspense>
          </AppLayout>
        </BrowserRouter>
        </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
