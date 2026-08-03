import { AppointmentStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const createAppointmentSchema = z
  .object({
    prisonerPublicId: z
      .string()
      .trim()
      .regex(/^PRN-\d{3}$/i, 'Valid Prisoner ID is required')
      .transform((value) => value.toUpperCase()),
    appointmentAt: z.string().datetime('Valid appointment date/time is required'),
    reason: z
      .string()
      .trim()
      .min(5, 'Reason must be at least 5 characters')
      .max(500, 'Reason is too long'),
  })
  .strict();

export const appointmentStatusFilterSchema = z
  .object({
    status: z.union([z.nativeEnum(AppointmentStatus), z.literal('ALL')]).default(AppointmentStatus.PENDING),
    search: z.string().trim().max(100).optional(),
    prisonerPublicId: z.string().trim().regex(/^PRN-\d{3}$/i).transform((value) => value.toUpperCase()).optional(),
    visitorPublicId: z.string().trim().regex(/^VIS-\d{3}$/i).transform((value) => value.toUpperCase()).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict()
  .refine((value) => !value.dateFrom || !value.dateTo || new Date(value.dateFrom) <= new Date(value.dateTo), {
    message: 'dateFrom must be before dateTo',
  });

export const reviewAppointmentSchema = z
  .object({
    status: z.enum([AppointmentStatus.ACCEPTED, AppointmentStatus.REJECTED]),
    officerNote: z.string().trim().max(500, 'Officer note is too long').optional(),
  })
  .strict();

export const appointmentParamsSchema = z.object({
  appointmentReference: z.string().trim().regex(/^APT-[A-F0-9]{24,32}$/i, 'Valid appointment reference is required').transform((value) => value.toUpperCase()),
});

export const prisonerPublicIdParamsSchema = z.object({
  prisonerPublicId: z
    .string()
    .trim()
    .regex(/^PRN-\d{3}$/i, 'Valid Prisoner ID is required')
    .transform((value) => value.toUpperCase()),
});


const validate =
  (
    schema: z.ZodType,
    source: 'body' | 'query' | 'params',
    message: string,
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message,
      });
      return;
    }

    if (source !== 'query') {
      req[source] = parsed.data as never;
    } else {
      res.locals.validatedQuery = parsed.data;
    }

    next();
  };

export const validateCreateAppointment = validate(
  createAppointmentSchema,
  'body',
  'Invalid appointment data',
);

export const validateAppointmentStatusFilter = validate(
  appointmentStatusFilterSchema,
  'query',
  'Invalid appointment status',
);

export const validateReviewAppointment = validate(
  reviewAppointmentSchema,
  'body',
  'Invalid appointment status',
);

export const validateAppointmentParams = validate(
  appointmentParamsSchema,
  'params',
  'Invalid appointment data',
);

export const validatePrisonerPublicIdParams = validate(
  prisonerPublicIdParamsSchema,
  'params',
  'Invalid Prisoner ID',
);
