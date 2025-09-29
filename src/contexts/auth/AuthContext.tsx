// src/contexts/auth/AuthContext.tsx
import { createContext } from "react";

// 1. Definir os tipos para o contexto
export interface AuthUser {
  username: string;
  // Adicione outras propriedades do usuário que o token possa conter, como roles
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Criar o Context com valores padrão
export const AuthContext = createContext<AuthContextType | undefined>(undefined);