import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (prefs: Partial<User['preferences']>) => void;
  updateStats: (statUpdates: Partial<User['stats']>) => void;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr_demo_1',
  name: 'Alex Rivera',
  email: 'alex@codebuddy.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'developer',
  preferences: {
    theme: 'deep-black',
    editorTheme: 'vs-dark',
    fontSize: 14,
    tabSize: 2,
    keybinding: 'standard',
    autoSave: true,
  },
  stats: {
    totalProjects: 14,
    codingHours: 148,
    aiSuggestions: 382,
    problemsSolved: 46,
    linesOfCode: 12450,
  },
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('codebuddy_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('codebuddy_token') || 'demo_token_active';
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    return localStorage.getItem('codebuddy_gemini_key') || '';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('codebuddy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codebuddy_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('codebuddy_token', token);
    } else {
      localStorage.removeItem('codebuddy_token');
    }
  }, [token]);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('codebuddy_gemini_key', key);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err: any) {
      console.warn('Backend login fallback to local demo auth:', err.message);
      // Fallback
      setUser({
        ...DEFAULT_DEMO_USER,
        email,
        name: email.split('@')[0],
      });
      setToken('demo_token_fallback');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err: any) {
      console.warn('Backend signup fallback:', err.message);
      const newUser: User = {
        ...DEFAULT_DEMO_USER,
        id: `usr_${Date.now()}`,
        name,
        email,
        stats: {
          totalProjects: 1,
          codingHours: 1,
          aiSuggestions: 5,
          problemsSolved: 0,
          linesOfCode: 50,
        },
      };
      setUser(newUser);
      setToken('token_' + Date.now());
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
      } else {
        setUser(DEFAULT_DEMO_USER);
        setToken('demo_token_static');
      }
      return true;
    } catch (err) {
      setUser(DEFAULT_DEMO_USER);
      setToken('demo_token_static');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codebuddy_user');
    localStorage.removeItem('codebuddy_token');
  };

  const updateUserPreferences = (prefs: Partial<User['preferences']>) => {
    if (!user) return;
    const updated = {
      ...user,
      preferences: {
        ...user.preferences,
        ...prefs,
      },
    };
    setUser(updated);
  };

  const updateStats = (statUpdates: Partial<User['stats']>) => {
    if (!user) return;
    const updated = {
      ...user,
      stats: {
        ...user.stats,
        ...statUpdates,
      },
    };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        geminiApiKey,
        setGeminiApiKey,
        login,
        signup,
        demoLogin,
        logout,
        updateUserPreferences,
        updateStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
