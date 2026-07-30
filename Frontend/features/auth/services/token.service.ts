import { apiRequest } from '@/lib/api';
import { LoginResponse, Role } from '@features/auth/types';

const ACCESS_TOKEN_KEY = 'jailmeet_access_token';
export const AUTH_CLEARED_EVENT = 'jailmeet:auth-cleared';
export const AUTH_CHANGED_EVENT = 'jailmeet:auth-changed';
export const AUTH_FORBIDDEN_EVENT = 'jailmeet:auth-forbidden';

export const login = async (
  email: string,
  password: string,
  expectedRole: Role,
): Promise<LoginResponse> =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, expectedRole }),
  });

export const saveAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
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
    window.dispatchEvent(new Event(AUTH_CLEARED_EVENT));
  }
};
