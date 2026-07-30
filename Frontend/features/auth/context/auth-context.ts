import { createContext } from 'react';

import { AuthUser } from '@features/auth/types';

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isForbidden: boolean;
  reload: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
