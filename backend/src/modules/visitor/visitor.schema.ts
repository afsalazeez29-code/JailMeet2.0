import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const isValidDateOnly = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const updateVisitorProfileSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
      .optional(),
    address: z
      .string()
      .trim()
      .max(255, 'Address is too long')
      .transform((value) => value || null)
      .optional(),
    state: z
      .string()
      .trim()
      .max(100, 'State is too long')
      .transform((value) => value || null)
      .optional(),
    city: z
      .string()
      .trim()
      .max(100, 'City is too long')
      .transform((value) => value || null)
      .optional(),
    country: z
      .string()
      .trim()
      .max(100, 'Country is too long')
      .transform((value) => value || null)
      .optional(),
    zip: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || /^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(value),
        'Postal code must be between 2 and 12 letters, numbers, spaces, or hyphens',
      )
      .transform((value) => value || null)
      .optional(),
    dateOfBirth: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || isValidDateOnly(value),
        'Date of birth must be a valid date',
      )
      .transform((value) =>
        value ? new Date(`${value}T00:00:00.000Z`) : null,
      )
      .optional(),
    gender: z
      .union([z.enum(['MALE', 'FEMALE', 'OTHER']), z.literal('')])
      .transform((value) => value || null)
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one visitor profile field is required',
  });


export const validateUpdateVisitorProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const parsedBody = updateVisitorProfileSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid visitor profile data',
    });
    return;
  }

  req.body = parsedBody.data;
  next();
};
