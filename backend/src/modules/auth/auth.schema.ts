import { z } from 'zod';
import { Role } from '@prisma/client';

import { newPasswordSchema } from '../../utils/password-policy';

export const keralaDistricts = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
] as const;

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email('Valid email is required')
      .transform((email) => email.toLowerCase()),
    password: z.string().min(1, 'Password is required'),
    expectedRole: z.nativeEnum(Role).optional(),
  })
  .strict();

export const registerVisitorSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z
      .string()
      .trim()
      .email('Valid email is required')
      .transform((email) => email.toLowerCase()),
    password: newPasswordSchema,
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, 'Phone must contain exactly 10 digits'),
    address: z.string().trim().max(500).optional(),
    state: z.enum(keralaDistricts, { message: 'Valid district is required' }),
    zip: z.string().trim().max(20).optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: newPasswordSchema,
    confirmNewPassword: newPasswordSchema,
  })
  .strict()
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });
