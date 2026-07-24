import { apiRequest } from '@/lib/api';
import { LoginResponse } from '@features/auth/types';

const ACCESS_TOKEN_KEY = 'jailmeet_access_token';

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const saveAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
