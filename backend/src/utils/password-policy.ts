import { z } from 'zod';

export const NEW_PASSWORD_MIN_LENGTH = 8;
export const NEW_PASSWORD_MAX_LENGTH = 20;
export const NEW_PASSWORD_HELP =
  'Use 8–20 characters with at least one letter and one number.';

export const newPasswordSchema = z
  .string()
  .min(
    NEW_PASSWORD_MIN_LENGTH,
    `Password must contain at least ${NEW_PASSWORD_MIN_LENGTH} characters`,
  )
  .max(
    NEW_PASSWORD_MAX_LENGTH,
    `Password must contain at most ${NEW_PASSWORD_MAX_LENGTH} characters`,
  )
  .refine((value) => value === value.trim(), {
    message: 'Password cannot start or end with spaces',
  })
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number');
