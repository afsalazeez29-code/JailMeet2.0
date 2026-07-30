import { z } from 'zod';
import { Role } from '@prisma/client';

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
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password is too long'),
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
    newPassword: z
      .string()
      .min(8, 'New password must contain at least 8 characters')
      .max(100, 'New password is too long'),
  })
  .strict();
