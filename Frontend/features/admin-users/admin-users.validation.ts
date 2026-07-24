const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAdminCreateCredentials = (
  email: string,
  password: string,
): string | null => {
  if (!emailPattern.test(email)) {
    return 'Valid email is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  return null;
};

export const validateRequiredName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }

  return null;
};