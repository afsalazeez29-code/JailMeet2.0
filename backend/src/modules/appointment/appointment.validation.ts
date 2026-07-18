import { AppointmentStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const createAppointmentSchema = z
  .object({
    prisonerId: z.string().trim().min(1, 'Prisoner is required'),
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
    status: z.nativeEnum(AppointmentStatus).optional(),
  })
  .strict();

export const reviewAppointmentSchema = z
  .object({
    status: z.enum([AppointmentStatus.ACCEPTED, AppointmentStatus.REJECTED]),
    officerNote: z.string().trim().max(500, 'Officer note is too long').optional(),
  })
  .strict();

export const appointmentParamsSchema = z.object({
  appointmentId: z.string().trim().min(1, 'Appointment ID is required'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type AppointmentStatusFilterInput = z.infer<
  typeof appointmentStatusFilterSchema
>;
export type ReviewAppointmentInput = z.infer<typeof reviewAppointmentSchema>;

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
