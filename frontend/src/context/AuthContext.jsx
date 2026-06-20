import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { authService } from '../services/authService.js';
import { TOKEN_KEY, USER_KEY } from '../config/constants.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const setTokenStorage = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(newToken);
  }, []);

  const setUserStorage = useCallback((newUser) => {
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(newUser);
  }, []);

  /** Fetch full profile from GET /api/auth/me */
  const refreshUser = useCallback(async () => {
    const { data } = await authService.getMe();
    const fullUser = data.data.user;
    setUserStorage(fullUser);
    return fullUser;
  }, [setUserStorage]);

  const clearAuth = useCallback(() => {
    setTokenStorage(null);
    setUserStorage(null);
  }, [setTokenStorage, setUserStorage]);

  // Restore session: token exists → verify with /auth/me
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [refreshUser, clearAuth]);

  const register = async (formData) => {
    const { data } = await authService.register(formData);
    const { token: newToken } = data.data;
    setTokenStorage(newToken);
    await refreshUser();
    return data;
  };

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    const { token: newToken } = data.data;
    setTokenStorage(newToken);
    await refreshUser();
    return data;
  };

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      register,
      login,
      logout,
      refreshUser,
    }),
    [user, token, loading, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
