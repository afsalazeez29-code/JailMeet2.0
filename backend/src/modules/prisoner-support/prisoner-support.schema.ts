import {
  PrisonerSupportCategory,
  SupportRequestStatus,
} from '@prisma/client';
import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
};

export const createPrisonerSupportSchema = z.object({
  category: z.nativeEnum(PrisonerSupportCategory),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(3000),
}).strict();

export const prisonerSupportQuerySchema = z.object({ ...pagination }).strict();

export const adminPrisonerSupportQuerySchema = z.object({
  ...pagination,
  category: z.nativeEnum(PrisonerSupportCategory).optional(),
  status: z.nativeEnum(SupportRequestStatus).optional(),
}).strict();

export const prisonerSupportParamsSchema = z.object({
  requestId: z.string().uuid(),
}).strict();

export const updatePrisonerSupportSchema = z.object({
  status: z.enum([
    SupportRequestStatus.IN_PROGRESS,
    SupportRequestStatus.RESOLVED,
    SupportRequestStatus.CLOSED,
  ]),
  adminReply: z.string().trim().min(2).max(3000).optional(),
}).strict();

export const validateCreatePrisonerSupport = validateRequest(
  createPrisonerSupportSchema,
  'body',
  'Invalid support request',
);
export const validatePrisonerSupportQuery = validateRequest(
  prisonerSupportQuerySchema,
  'query',
  'Invalid support filters',
);
export const validateAdminPrisonerSupportQuery = validateRequest(
  adminPrisonerSupportQuerySchema,
  'query',
  'Invalid support filters',
);
export const validatePrisonerSupportParams = validateRequest(
  prisonerSupportParamsSchema,
  'params',
  'Invalid support request ID',
);
export const validateUpdatePrisonerSupport = validateRequest(
  updatePrisonerSupportSchema,
  'body',
  'Invalid support response',
);
