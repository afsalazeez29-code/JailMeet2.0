'use client';

import { useContext } from 'react';

import { AuthContext } from '@features/auth/context/auth-context';

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return auth;
};
