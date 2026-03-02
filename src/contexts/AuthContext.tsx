import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number | string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const AUTH_EVENT_KEY = 'auth:event';
const TAB_ID_KEY = 'auth:tabId';

type AuthEventType = 'LOGIN' | 'LOGOUT';

interface AuthEventPayload {
  type: AuthEventType;
  sourceTabId: string;
  at: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getTabId = () => {
    let tabId = sessionStorage.getItem(TAB_ID_KEY);
    if (!tabId) {
      tabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(TAB_ID_KEY, tabId);
    }
    return tabId;
  };

  const broadcastEvent = (type: AuthEventType) => {
    const payload: AuthEventPayload = {
      type,
      sourceTabId: getTabId(),
      at: Date.now(),
    };
    localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify(payload));
  };

  const clearSession = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    // limpeza de legado
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const applyLoggedOutState = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Migração: se existir token legado no localStorage, move para sessionStorage
    const legacyToken = localStorage.getItem(TOKEN_KEY);
    const legacyUser = localStorage.getItem(USER_KEY);
    if (legacyToken && legacyUser && !sessionStorage.getItem(TOKEN_KEY)) {
      sessionStorage.setItem(TOKEN_KEY, legacyToken);
      sessionStorage.setItem(USER_KEY, legacyUser);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    const token = sessionStorage.getItem(TOKEN_KEY);
    const userData = sessionStorage.getItem(USER_KEY);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearSession();
        applyLoggedOutState();
      }
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_EVENT_KEY || !event.newValue) {
        return;
      }

      try {
        const payload = JSON.parse(event.newValue) as AuthEventPayload;
        if (payload.sourceTabId === getTabId()) {
          return;
        }

        if (payload.type === 'LOGIN' || payload.type === 'LOGOUT') {
          clearSession();
          applyLoggedOutState();
        }
      } catch (error) {
        console.error('Error parsing auth sync event:', error);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (token: string, userData: User) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    // limpeza de legado
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(userData);
    setIsAuthenticated(true);
    broadcastEvent('LOGIN');
  };

  const logout = () => {
    clearSession();
    applyLoggedOutState();
    broadcastEvent('LOGOUT');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
