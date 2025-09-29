// src/contexts/auth/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Precisaremos de uma biblioteca para decodificar o token
import { type AuthUser } from './AuthContext';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para checagem inicial do token

  // Efeito para verificar se já existe um token no localStorage ao carregar a app
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        // Validação básica do token (decodificar para checar expiração)
        const decodedToken: { sub: string, exp: number } = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser({ username: decodedToken.sub });
        } else {
          // Token expirado, remove do localStorage
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    try {
      localStorage.setItem('authToken', newToken);
      const decodedToken: { sub: string } = jwtDecode(newToken);
      setToken(newToken);
      setUser({ username: decodedToken.sub });
    } catch (error) {
      console.error("Failed to process login token:", error);
      // Limpar estado em caso de erro
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    isAuthenticated: !!token,
    token,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
