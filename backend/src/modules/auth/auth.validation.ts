import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerVisitorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().trim().min(1, 'Phone is required'),
  address: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must contain at least 8 characters')
      .max(100, 'New password is too long'),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterVisitorInput = z.infer<typeof registerVisitorSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
