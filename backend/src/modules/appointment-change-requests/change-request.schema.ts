import {
  AppointmentChangeRequestStatus,
  AppointmentChangeRequestType,
} from '@prisma/client';
import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

const reason = z.string().trim().min(5).max(500);

export const cancelRequestSchema = z
  .object({ reason, confirmed: z.literal(true) })
  .strict();

export const rescheduleRequestSchema = z
  .object({
    requestedAt: z.string().datetime(),
    reason,
  })
  .strict();

export const appointmentParamsSchema = z.object({
  appointmentId: z.string().uuid(),
});

export const requestParamsSchema = z.object({
  requestId: z.string().uuid(),
});

export const visitorRequestQuerySchema = z
  .object({
    status: z.nativeEnum(AppointmentChangeRequestStatus).optional(),
  })
  .strict();

export const officerRequestQuerySchema = z
  .object({
    status: z.nativeEnum(AppointmentChangeRequestStatus).default(AppointmentChangeRequestStatus.PENDING),
    requestType: z.nativeEnum(AppointmentChangeRequestType).optional(),
  })
  .strict();

export const reviewRequestSchema = z
  .object({
    status: z.enum([
      AppointmentChangeRequestStatus.APPROVED,
      AppointmentChangeRequestStatus.REJECTED,
    ]),
    officerReply: z.string().trim().max(500).optional(),
  })
  .strict();

export const validateCancelRequest = validateRequest(cancelRequestSchema, 'body', 'Invalid cancellation request');
export const validateRescheduleRequest = validateRequest(rescheduleRequestSchema, 'body', 'Invalid reschedule request');
export const validateAppointmentParams = validateRequest(appointmentParamsSchema, 'params', 'Invalid appointment ID');
export const validateRequestParams = validateRequest(requestParamsSchema, 'params', 'Invalid request ID');
export const validateVisitorRequestQuery = validateRequest(visitorRequestQuerySchema, 'query', 'Invalid request filters');
export const validateOfficerRequestQuery = validateRequest(officerRequestQuerySchema, 'query', 'Invalid request filters');
export const validateReviewRequest = validateRequest(reviewRequestSchema, 'body', 'Invalid request decision');
