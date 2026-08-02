import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

export const verifyPassSchema = z
  .object({
    passCode: z.string().trim().min(20).max(120),
  })
  .strict();

export const passCodeParamsSchema = z.object({
  passCode: z.string().trim().min(20).max(120),
});

export const historyQuerySchema = z
  .object({
    status: z.enum(['COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

export const validateVerifyPass = validateRequest(
  verifyPassSchema,
  'body',
  'Invalid visit pass code',
);
export const validatePassCodeParams = validateRequest(
  passCodeParamsSchema,
  'params',
  'Invalid visit pass code',
);
export const validateHistoryQuery = validateRequest(
  historyQuerySchema,
  'query',
  'Invalid history filters',
);
