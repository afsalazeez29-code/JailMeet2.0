import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

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
    zip: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || /^[0-9]{6}$/.test(value),
        'Zip must be exactly 6 digits',
      )
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
