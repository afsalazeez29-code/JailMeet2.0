import { validateNewPassword } from '@features/auth/password-policy';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAdminCreateCredentials = (
  email: string,
  password: string,
): string | null => {
  if (!emailPattern.test(email)) {
    return 'Valid email is required';
  }

  return validateNewPassword(password);
};

export const validateRequiredName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }

  return null;
};
