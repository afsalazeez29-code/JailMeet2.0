import { SupportCategory, SupportRequestStatus } from '@prisma/client';
import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
};

export const createSupportRequestSchema = z.object({
  category: z.nativeEnum(SupportCategory),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(3000),
}).strict();

export const visitorSupportQuerySchema = z.object({ ...pagination }).strict();
export const adminSupportQuerySchema = z.object({
  ...pagination,
  category: z.nativeEnum(SupportCategory).optional(),
  status: z.nativeEnum(SupportRequestStatus).optional(),
}).strict();

export const supportParamsSchema = z.object({ requestId: z.string().uuid() });

export const updateSupportRequestSchema = z.object({
  status: z.enum([
    SupportRequestStatus.IN_PROGRESS,
    SupportRequestStatus.RESOLVED,
    SupportRequestStatus.CLOSED,
  ]),
  adminReply: z.string().trim().min(2).max(3000).optional(),
}).strict();

export const validateCreateSupportRequest = validateRequest(createSupportRequestSchema, 'body', 'Invalid support request');
export const validateVisitorSupportQuery = validateRequest(visitorSupportQuerySchema, 'query', 'Invalid support filters');
export const validateAdminSupportQuery = validateRequest(adminSupportQuerySchema, 'query', 'Invalid support filters');
export const validateSupportParams = validateRequest(supportParamsSchema, 'params', 'Invalid support request ID');
export const validateUpdateSupportRequest = validateRequest(updateSupportRequestSchema, 'body', 'Invalid support response');
