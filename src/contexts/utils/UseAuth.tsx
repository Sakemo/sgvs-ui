// src/contexts/utils/UseAuth.tsx
import { AuthContext } from '../auth/AuthContext';
import { type AuthContextType } from '../auth/AuthContext';
import { useContext } from 'react';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};