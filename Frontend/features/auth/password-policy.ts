export const NEW_PASSWORD_MIN_LENGTH = 8;
export const NEW_PASSWORD_MAX_LENGTH = 20;
export const NEW_PASSWORD_HELP =
  'Use 8–20 characters with at least one letter and one number.';

export const validateNewPassword = (password: string): string | null => {
  if (password.length < NEW_PASSWORD_MIN_LENGTH) {
    return `Password must contain at least ${NEW_PASSWORD_MIN_LENGTH} characters`;
  }
  if (password.length > NEW_PASSWORD_MAX_LENGTH) {
    return `Password must contain at most ${NEW_PASSWORD_MAX_LENGTH} characters`;
  }
  if (password !== password.trim()) {
    return 'Password cannot start or end with spaces';
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'Password must contain at least one letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};
